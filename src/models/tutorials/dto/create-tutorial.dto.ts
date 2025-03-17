import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt, Min, IsUrl } from 'class-validator';

export class CreateTutorialDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsInt()
  @Min(1)
  estimated_read_time: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  coverImage: string; // Base64 encoded image
}