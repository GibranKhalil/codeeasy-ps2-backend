import { Game } from 'src/models/games/entities/game.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { CreateGameDto } from 'src/models/games/dto/create-game.dto';
import { UpdateGameDto } from 'src/models/games/dto/update-game.dto';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';

export type IGamesRepository = IGenericRepository<
  IPaginatedResult<Game>,
  Game,
  CreateGameDto,
  UpdateGameDto,
  Game
>;
