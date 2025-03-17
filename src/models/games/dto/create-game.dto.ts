import { IsString, IsInt, IsArray, IsOptional, Min, IsNotEmpty } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import type { Express } from "express"

export class CreateGameDto {
  @ApiProperty({ description: "The game title" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ description: "A short description of the game" })
  @IsString()
  @IsNotEmpty()
  short_description: string

  @ApiProperty({ description: "The game category" })
  @IsString()
  @IsNotEmpty()
  category: string

  @ApiPropertyOptional({ description: "Array of tags related to the game", type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[]

  @ApiProperty({ description: "The game version" })
  @IsString()
  @IsNotEmpty()
  version: string

  @ApiProperty({ description: "The size of the game file in MB" })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  file_size: number

  @ApiProperty({ description: "Cover image file (will be uploaded to Supabase Storage)" })
  cover_image: Express.Multer.File

  @ApiProperty({ description: "Screenshot files (will be uploaded to Supabase Storage)", type: [Object] })
  @IsArray()
  @IsNotEmpty()
  screenshots: Express.Multer.File[]

  @ApiProperty({ description: "Game description file in Markdown format (will be uploaded to GitHub)" })
  game_description: Express.Multer.File

  @ApiProperty({ description: "Game file (will be uploaded to Backblaze B2)" })
  game_file: Express.Multer.File
}

