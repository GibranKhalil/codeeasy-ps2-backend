import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { CreateSnippetDto } from './dto/create-snippet.dto';
import type { UpdateSnippetDto } from './dto/update-snippet.dto';
import { SnippetService } from './snippet.service';

@Controller('snippet')
export class SnippetController {
  constructor(private readonly snippetsService: SnippetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSnippetDto: CreateSnippetDto) {
    return this.snippetsService.create(createSnippetDto);
  }

  @Get()
  findAll() {
    return this.snippetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSnippetDto: UpdateSnippetDto) {
    return this.snippetsService.update(+id, updateSnippetDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.snippetsService.remove(+id);
  }
}
