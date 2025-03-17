import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase/supabase.service';
import { Octokit } from '@octokit/rest';
import { ConfigService } from '@nestjs/config';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { decode } from 'base64-arraybuffer';

@Injectable()
export class TutorialsService {
  private octokit: Octokit;
  private readonly owner: string;
  private readonly repo: string;

  constructor(
    private supabase: SupabaseService,
    private configService: ConfigService,
  ) {
    this.octokit = new Octokit({
      auth: this.configService.get<string>('GITHUB_TOKEN'),
    });
    this.owner = this.configService.get<string>('GITHUB_OWNER');
    this.repo = this.configService.get<string>('GITHUB_REPO');
  }

  async create(createTutorialDto: CreateTutorialDto, userId: string) {
    try {
      // Upload cover image to Supabase Storage
      const coverImageData = decode(createTutorialDto.coverImage.split(',')[1]);
      const filename = `${Date.now()}-${this.sanitizeFilename(createTutorialDto.title)}`;
      const imagePath = `tutorials/${userId}/${filename}.jpg`;
      
      const { data: imageData, error: imageError } = await this.supabase.getClient()
        .storage
        .from('tutorial-covers')
        .upload(imagePath, coverImageData, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        });

      if (imageError) {
        throw new BadRequestException('Failed to upload cover image');
      }

      // Get the public URL for the uploaded image
      const { data: { publicUrl: coverImageUrl } } = this.supabase.getClient()
        .storage
        .from('tutorial-covers')
        .getPublicUrl(imagePath);

      // Save markdown content to GitHub
      const markdownPath = `tutorials/${userId}/${this.sanitizeFilename(createTutorialDto.title)}.md`;
      
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: markdownPath,
        message: `Add tutorial: ${createTutorialDto.title}`,
        content: Buffer.from(createTutorialDto.content).toString('base64'),
        branch: 'main',
      });

      // Create tutorial record in Supabase
      const { data: tutorial, error } = await this.supabase.getClient()
        .from('tutorials')
        .insert([{
          title: createTutorialDto.title,
          excerpt: createTutorialDto.excerpt,
          category: createTutorialDto.category,
          tags: createTutorialDto.tags || [],
          estimated_read_time: createTutorialDto.estimated_read_time,
          cover_image_url: coverImageUrl,
          content_url: `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/${markdownPath}`,
          author: userId,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return tutorial;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create tutorial');
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}