import { Game } from 'src/models/games/entities/game.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { CreateGameDto } from 'src/models/games/dto/create-game.dto';
import { UpdateGameDto } from 'src/models/games/dto/update-game.dto';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { Interactions } from 'src/@types/interactions.type';

export interface IGamesRepository
  extends IGenericRepository<
    IPaginatedResult<Game>,
    Game,
    CreateGameDto,
    UpdateGameDto,
    Game
  > {
  findFeaturedGamesWithCreator(): Promise<Game[]>;
  findByCreator(
    creatorId: number,
    pagination: PaginationParams,
    excludePid?: string,
  ): Promise<IPaginatedResult<Game>>;
  addInteraction(id: number, interactionDto: keyof Interactions);
}
