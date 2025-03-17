import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase/supabase.service';
import { Octokit } from '@octokit/rest';
import { ConfigService } from '@nestjs/config';
import { CreateSnippetDto } from './dto/create-snippet.dto';

@Injectable()
export class SnippetsService {
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

  async create(createSnippetDto: CreateSnippetDto, userId: string) {
    try {
      const filename = `${Date.now()}-${this.sanitizeFilename(createSnippetDto.title)}.${this.getFileExtension(createSnippetDto.language)}`;
      const path = `snippets/${userId}/${filename}`;

      // Upload to GitHub
      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: `Add snippet: ${createSnippetDto.title}`,
        content: Buffer.from(createSnippetDto.code).toString('base64'),
        branch: 'main',
      });

      // Create snippet record in Supabase
      const { data: snippet, error } = await this.supabase.getClient()
        .from('snippets')
        .insert([{
          ...createSnippetDto,
          author: userId,
          code_url: `https://raw.githubusercontent.com/${this.owner}/${this.repo}/main/${path}`,
          modifiers: [],
          tags: createSnippetDto.tags || [],
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return snippet;
    } catch (error) {
      if (error.status === 422) {
        throw new BadRequestException('Failed to create snippet: File already exists');
      }
      throw new InternalServerErrorException('Failed to create snippet');
    }
  }

  async findByTags(tags: string[], userId: string) {
    const { data, error } = await this.supabase.getClient()
      .from('snippets')
      .select('*')
      .eq('author', userId)
      .contains('tags', tags);

    if (error) {
      throw new InternalServerErrorException('Failed to fetch snippets');
    }

    return data;
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private getFileExtension(language: string): string {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      'c++': 'cpp',
      csharp: 'cs',
      'c#': 'cs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      go: 'go',
      rust: 'rs',
      kotlin: 'kt',
      scala: 'scala',
    };

    return extensions[language.toLowerCase()] || 'txt';
  }
}