import { Injectable, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Game } from "./entities/game.entity"
import type { CreateGameDto } from "./dto/create-game.dto"
import type { SupabaseService } from "../config/supabase/supabase.service"
import * as crypto from "crypto"
import axios from "axios"
import { Octokit } from "@octokit/rest"
import type { Express } from "express"

@Injectable()
export class GamesService {
  private readonly octokit: Octokit
  private readonly backblazeApiUrl: string
  private readonly backblazeAuthToken: string
  private readonly backblazeBucketId: string
  private readonly githubToken: string
  private readonly githubOwner: string
  private readonly githubRepo: string;

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly supabaseService: SupabaseService,
  ) {
    // Initialize GitHub client
    this.githubToken = process.env.GITHUB_TOKEN;
    this.githubOwner = process.env.GITHUB_OWNER;
    this.githubRepo = process.env.GITHUB_REPO;
    this.octokit = new Octokit({ auth: this.githubToken });

    // Initialize Backblaze B2 credentials
    this.backblazeApiUrl = process.env.BACKBLAZE_API_URL;
    this.backblazeAuthToken = process.env.BACKBLAZE_AUTH_TOKEN;
    this.backblazeBucketId = process.env.BACKBLAZE_BUCKET_ID;
  }

  async create(
    createGameDto: CreateGameDto,
    files: {
      cover_image: Express.Multer.File[]
      screenshots: Express.Multer.File[]
      game_description: Express.Multer.File[]
      game_file: Express.Multer.File[]
    },
  ): Promise<Game> {
    try {
      // Validate file sizes
      this.validateFileSize(files.game_file[0], createGameDto.file_size)

      // Upload cover image to Supabase Storage
      const coverImageUrl = await this.uploadToSupabase(files.cover_image[0], "cover-images")

      // Upload screenshots to Supabase Storage
      const screenshotUrls = await Promise.all(
        files.screenshots.map((file) => this.uploadToSupabase(file, "screenshots")),
      )

      // Upload game description to GitHub
      const gameDescriptionUrl = await this.uploadToGitHub(files.game_description[0])

      // Upload game file to Backblaze B2
      const gameFileUrl = await this.uploadToBackblaze(files.game_file[0])

      // Create new game entity
      const game = this.gameRepository.create({
        title: createGameDto.title,
        short_description: createGameDto.short_description,
        category: createGameDto.category,
        tags: createGameDto.tags || [],
        version: createGameDto.version,
        file_size: createGameDto.file_size,
        cover_image_url: coverImageUrl,
        screenshots: screenshotUrls,
        game_description_url: gameDescriptionUrl,
        file_url: gameFileUrl,
      })

      // Save to database
      return this.gameRepository.save(game)
    } catch (error) {
      throw new BadRequestException(`Failed to create game: ${error.message}`)
    }
  }

  private validateFileSize(file: Express.Multer.File, declaredSize: number): void {
    // Convert bytes to MB for comparison
    const actualSizeMB = Math.round(file.size / (1024 * 1024))
    const tolerance = 5 // 5MB tolerance

    if (Math.abs(actualSizeMB - declaredSize) > tolerance) {
      throw new BadRequestException(
        `Declared file size (${declaredSize}MB) doesn't match actual file size (${actualSizeMB}MB)`,
      )
    }
  }

  private async uploadToSupabase(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const fileName = `${crypto.randomUUID()}-${file.originalname}`
      const { data, error } = await this.supabaseService
        .getClient()
        .storage.from("games")
        .upload(`${folder}/${fileName}`, file.buffer, {
          contentType: file.mimetype,
          cacheControl: "3600",
        })

      if (error) throw new Error(error.message)

      // Get public URL
      const { data: urlData } = this.supabaseService
        .getClient()
        .storage.from("games")
        .getPublicUrl(`${folder}/${fileName}`)

      return urlData.publicUrl
    } catch (error) {
      throw new BadRequestException(`Failed to upload to Supabase: ${error.message}`)
    }
  }

  private async uploadToGitHub(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = `game-descriptions/${crypto.randomUUID()}.md`
      const content = file.buffer.toString("base64")

      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.githubOwner,
        repo: this.githubRepo,
        path: fileName,
        message: `Add game description: ${file.originalname}`,
        content,
        branch: "main",
      })

      // Return the raw URL to the file
      return `https://raw.githubusercontent.com/${this.githubOwner}/${this.githubRepo}/main/${fileName}`
    } catch (error) {
      throw new BadRequestException(`Failed to upload to GitHub: ${error.message}`)
    }
  }

  private async uploadToBackblaze(file: Express.Multer.File): Promise<string> {
    try {
      // Step 1: Get upload URL
      const authResponse = await axios.post(
        `${this.backblazeApiUrl}/b2api/v2/b2_get_upload_url`,
        { bucketId: this.backblazeBucketId },
        {
          headers: {
            Authorization: this.backblazeAuthToken,
          },
        },
      )

      const { uploadUrl, authorizationToken } = authResponse.data

      // Step 2: Upload file
      const fileName = `games/${crypto.randomUUID()}-${file.originalname}`
      const uploadResponse = await axios.post(uploadUrl, file.buffer, {
        headers: {
          Authorization: authorizationToken,
          "Content-Type": file.mimetype,
          "X-Bz-File-Name": encodeURIComponent(fileName),
          "X-Bz-Content-Sha1": crypto.createHash("sha1").update(file.buffer).digest("hex"),
        },
      })

      // Step 3: Return the download URL
      return `${process.env.BACKBLAZE_DOWNLOAD_URL}/${fileName}`
    } catch (error) {
      throw new BadRequestException(`Failed to upload to Backblaze B2: ${error.message}`)
    }
  }
}

