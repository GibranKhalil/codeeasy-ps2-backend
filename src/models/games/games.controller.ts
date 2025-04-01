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
  NotFoundException,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/guards/roles.guard';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createGameDto: CreateGameDto) {
    if (!createGameDto.creatorId) {
      throw new BadRequestException('É preciso que o jogo tenha um criador');
    }
    return this.gamesService.create(createGameDto);
  }

  @Get('/featured')
  findFeaturedContent() {
    return this.gamesService.findFeaturedGames();
  }

  @Get('/creator/:id')
  @UseGuards(JwtAuthGuard)
  findByCreator(
    @Param('id') id: number,
    @Query() pagination: PaginationParams,
  ) {
    return this.gamesService.findByCreator(id, pagination);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto);
  }

  @Patch('/pub/:id/:status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  publishSnippet(@Param('id') id: number, @Param('status') status: number) {
    if (!Object.values(eContentStatus).includes(Number(status))) {
      throw new NotFoundException('Status não encontrado');
    }

    return this.gamesService.publishGameOrReject(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
