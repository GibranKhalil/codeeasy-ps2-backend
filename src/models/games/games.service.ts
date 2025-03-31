import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { IGamesRepository } from 'src/@types/interfaces/repositories/iGamesRepository.interface';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';

@Injectable()
export class GamesService {
  constructor(
    @Inject('IGamesRepository')
    private readonly gameRepository: IGamesRepository,
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('ISubmissionsRepository')
    private readonly submissionRepository: ISubmissionsRepository,
  ) {}

  async create(createGameDto: CreateGameDto) {
    if (!createGameDto.creatorId) {
      throw new BadRequestException('É preciso que o jogo tenha um criador');
    }

    const creator = await this.usersRepository.findOneBy({
      id: createGameDto.creatorId,
    });

    if (!creator) {
      throw new NotFoundException('Criador não encontrado');
    }

    const newGame = this.gameRepository.create({ ...createGameDto, creator });

    const game = await this.gameRepository.save(newGame);

    const newSubmission = this.submissionRepository.create({
      title: `Jogo: ${game.title}`,
      type: 'game',
      game,
      creator,
    });

    await this.submissionRepository.save(newSubmission);

    return game;
  }

  findAll(page = 1, limit = 10) {
    return this.gameRepository.find(page, limit);
  }

  findByCreator(creatorId: number, pagination: PaginationParams) {
    return this.gameRepository.findByCreator(creatorId, pagination);
  }

  findFeaturedGames() {
    return this.gameRepository.findFeaturedGamesWithCreator();
  }

  findOne(id: number) {
    return this.gameRepository.findOneBy({ id });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  remove(id: number) {
    return this.gameRepository.delete(id);
  }
}
