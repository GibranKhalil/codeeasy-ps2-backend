import { Game } from 'src/models/games/entities/game.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { CreateGameDto } from 'src/models/games/dto/create-game.dto';
import { UpdateGameDto } from 'src/models/games/dto/update-game.dto';

export type IGamesRepository = IGenericRepository<
  Game,
  Game,
  CreateGameDto,
  UpdateGameDto,
  Game
>;
