import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { IGamesRepository } from 'src/@types/interfaces/repositories/iGamesRepository.interface';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { User } from '../users/entities/user.entity';
import { Game } from './entities/game.entity';
import { SubmissionStatus } from '../submissions/entities/submission.entity';

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
    const creator = await this.usersRepository.findOneBy({
      id: createGameDto.creatorId,
    });

    if (!creator) {
      throw new NotFoundException('Criador não encontrado');
    }

    const game = await this.createAndSubmitGame(createGameDto, creator);
    await this.createSubmissionForGame(creator, game);

    return game;
  }

  private async createAndSubmitGame(createGame: CreateGameDto, creator: User) {
    const newGame = this.gameRepository.create({ ...createGame, creator });
    const game = await this.gameRepository.save(newGame);

    return game;
  }

  private async createSubmissionForGame(creator: User, game: Game) {
    const newSubmission = this.submissionRepository.create({
      title: `Jogo: ${game.title}`,
      type: 'game',
      game,
      creator,
    });

    await this.submissionRepository.save(newSubmission);
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

  async publishGameOrReject(id: number, status: number) {
    const game = await this.gameRepository.findOneBy({ id });

    if (!game) {
      throw new NotFoundException('Jogo não encontrado');
    }

    const submission = await this.submissionRepository.findOne({
      where: {
        type: 'game',
        game: { id: game.id },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submissão não encontrada');
    }

    if (Number(status) === eContentStatus.APPROVED.valueOf()) {
      await this.handleSubmissionStatus(submission.id, 'approved');
    }

    if (Number(status) === eContentStatus.REJECTED.valueOf()) {
      await this.handleSubmissionStatus(submission.id, 'rejected');
    }

    const response = await this.gameRepository.update(game.id, {
      status: Number(status),
    });

    if (response.affected && response.affected <= 0) {
      throw new InternalServerErrorException(
        'Não foi possível atualizar o status do jogo',
      );
    }

    return response;
  }

  private async handleSubmissionStatus(id: number, status: SubmissionStatus) {
    const response = await this.submissionRepository.update(id, {
      status,
    });

    if (response.affected && response.affected <= 0) {
      throw new InternalServerErrorException(
        'Não foi possível atualizar o status da submissão',
      );
    }
  }

  remove(id: number) {
    return this.gameRepository.delete(id);
  }
}
