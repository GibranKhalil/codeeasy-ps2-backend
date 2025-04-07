import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { InteractDto } from './dto/interact.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'screenshots', maxCount: 3 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  create(
    @UploadedFiles()
    files: {
      screenshots?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    },
    @Body() createGameDto: CreateGameDto,
  ) {
    if (!createGameDto.creatorId) {
      throw new BadRequestException('É preciso que o jogo tenha um criador');
    }

    if (!files.coverImage?.[0]) {
      throw new BadRequestException(
        'É preciso que o jogo tenha uma foto de capa',
      );
    }

    if (!files.screenshots || files.screenshots.length < 1) {
      throw new BadRequestException(
        'É preciso que o jogo tenha pelo menos 1 screenshot',
      );
    }

    return this.gamesService.create(
      createGameDto,
      files.coverImage[0],
      files.screenshots,
    );
  }

  @Get('/featured')
  findFeaturedContent() {
    return this.gamesService.findFeaturedGames();
  }

  @Get('/creator/:id')
  findByCreator(
    @Param('id') id: number,
    @Query() pagination: PaginationParams,
    @Query('pid') excludePid: string,
  ) {
    return this.gamesService.findByCreator(id, pagination, excludePid);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('category') category: number,
  ) {
    return this.gamesService.findAll(page, limit, { category });
  }

  @Patch(':pid/interact')
  addInteraction(
    @Param('pid') pid: string,
    @Body() interactionDto: InteractDto,
  ) {
    const validInteractions = ['downloads', 'views', 'stars', 'likes'];
    if (!validInteractions.includes(interactionDto.type)) {
      throw new BadRequestException(
        `Tipo de interação inválido. Deve ser um dos seguintes: ${validInteractions.join(', ')}`,
      );
    }

    return this.gamesService.addInteraction(pid, interactionDto.type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Get('pid/:pid')
  findOneByPid(@Param('pid') pid: string) {
    return this.gamesService.findOne(0, pid);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
