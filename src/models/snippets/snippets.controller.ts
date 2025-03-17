import { Controller, Post, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';

@Controller('snippets')
@UseGuards(JwtAuthGuard)
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  async create(@Body() createSnippetDto: CreateSnippetDto, @Request() req) {
    return this.snippetsService.create(createSnippetDto, req.user.userId);
  }

  @Get('search')
  async findByTags(@Query('tags') tags: string[], @Request() req) {
    return this.snippetsService.findByTags(tags, req.user.userId);
  }
}