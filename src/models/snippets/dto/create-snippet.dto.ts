import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}