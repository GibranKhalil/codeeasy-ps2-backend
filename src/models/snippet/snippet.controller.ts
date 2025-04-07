import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { InteractDto } from '../games/dto/interact.dto';

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
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('engine') engine: string,
    @Query('language') language: string,
    @Query('search') search: string,
  ) {
    return this.snippetsService.findAll(page, limit, engine, language, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(+id);
  }

  @Get('pid/:pid')
  findOneByPid(@Param('pid') pid: string) {
    return this.snippetsService.findOneByPid(pid);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSnippetDto: UpdateSnippetDto) {
    return this.snippetsService.update(+id, updateSnippetDto);
  }

  @Patch(':pid/interact')
  addInteraction(
    @Param('pid') pid: string,
    @Body() interactionDto: InteractDto,
  ) {
    const validInteractions = ['views', 'likes', 'forks'];
    if (!validInteractions.includes(interactionDto.type)) {
      throw new BadRequestException(
        `Tipo de interação inválido. Deve ser um dos seguintes: ${validInteractions.join(', ')}`,
      );
    }

    return this.snippetsService.addInteraction(pid, interactionDto.type);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  remove(@Param('id') id: string) {
    return this.snippetsService.remove(+id);
  }
}
