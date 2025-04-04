import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { CreateSnippetDto } from './dto/create-snippet.dto';
import type { UpdateSnippetDto } from './dto/update-snippet.dto';
import { SnippetService } from './snippet.service';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('snippet')
export class SnippetController {
  constructor(private readonly snippetsService: SnippetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSnippetDto: CreateSnippetDto) {
    return this.snippetsService.create(createSnippetDto);
  }

  @Get('/featured')
  findFeaturedContent() {
    return this.snippetsService.findFeaturedContent();
  }

  @Get('/creator/:id')
  @UseGuards(JwtAuthGuard)
  findByCreator(
    @Param('id') id: number,
    @Query() pagination: PaginationParams,
  ) {
    return this.snippetsService.findByCreator(id, pagination);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  remove(@Param('id') id: string) {
    return this.snippetsService.remove(+id);
  }
}
