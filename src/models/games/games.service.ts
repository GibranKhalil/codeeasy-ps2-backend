import {
  BadRequestException,
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
import { User } from '../users/entities/user.entity';
import { Game } from './entities/game.entity';
import { StorageService } from '../storage/storage.service';
import { ICategoriesRepository } from 'src/@types/interfaces/repositories/iCategoriesRepository.interface';

@Injectable()
export class GamesService {
  constructor(
    @Inject('IGamesRepository')
    private readonly gameRepository: IGamesRepository,
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    @Inject('ISubmissionsRepository')
    private readonly submissionRepository: ISubmissionsRepository,
    @Inject('ICategoriesRepository')
    private readonly categoriesRepository: ICategoriesRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createGameDto: CreateGameDto,
    coverImage: Express.Multer.File,
    screenshots: Express.Multer.File[],
  ) {
    if (!createGameDto.category_id) {
      throw new BadRequestException('É preciso vincular uma categoria ao jogo');
    }

    const category = await this.categoriesRepository.findOneBy({
      id: createGameDto.category_id,
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const creator = await this.usersRepository.findOneBy({
      id: createGameDto.creatorId,
    });

    if (!creator) {
      throw new NotFoundException('Criador não encontrado');
    }

    const game = await this.createAndSubmitGame(
      { ...createGameDto, category, creator },
      coverImage,
      screenshots,
    );
    await this.createSubmissionForGame(creator, game);

    return game;
  }

  private async createAndSubmitGame(
    createGame: CreateGameDto,
    coverImage: Express.Multer.File,
    screenshotsParam: Express.Multer.File[],
  ) {
    let coverImage_url: string = '';
    let screenshots: string[] = [];

    try {
      if (coverImage) {
        coverImage_url = await this.storageService.uploadFile(
          coverImage.buffer,
          coverImage.originalname,
          coverImage.mimetype,
        );
      }

      if (screenshotsParam?.length) {
        screenshots = await Promise.all(
          screenshotsParam.map((screenshot) =>
            this.storageService.uploadFile(
              screenshot.buffer,
              screenshot.originalname,
              screenshot.mimetype,
            ),
          ),
        );
      }

      const newGame = this.gameRepository.create({
        ...createGame,
        fileSize: Number(Number(createGame.fileSize).toFixed(0)),
        screenshots,
        coverImage_url,
        tags: Array.isArray(createGame.tags)
          ? createGame.tags
          : String(createGame.tags)?.split(',') || [],
      });

      const game = await this.gameRepository.save(newGame);

      if (!game) {
        throw new InternalServerErrorException(
          'Erro ao criar o jogo! Tente novamente',
        );
      }

      return game;
    } catch (error) {
      console.error('Erro ao criar jogo:', error);

      if (coverImage_url) {
        await this.storageService.deleteFile(coverImage_url.split('/').pop()!);
      }

      if (screenshots.length) {
        await Promise.all(
          screenshots.map((url) =>
            this.storageService.deleteFile(url.split('/').pop()!),
          ),
        );
      }

      throw new InternalServerErrorException(
        'Erro ao criar o jogo! Tente novamente.',
      );
    }
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

  async findOne(id?: number, pid?: string) {
    let game: Game;

    if (pid) {
      game = (await this.gameRepository.findOne({
        where: { pid },
        relations: ['creator', 'category'],
      })) as Game;
    } else {
      game = (await this.gameRepository.findOne({
        where: { id },
        relations: ['creator', 'category'],
      })) as Game;
    }

    if (!game) {
      throw new NotFoundException(
        `Jogo não encontrado com ${pid ? `PID: ${pid}` : `ID: ${id}`}`,
      );
    }

    return game;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.gameRepository.update(id, updateGameDto);
  }

  remove(id: number) {
    return this.gameRepository.delete(id);
  }
}
