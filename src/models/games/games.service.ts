import { Inject, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { IGamesRepository } from 'src/@types/interfaces/repositories/iGamesRepository.interface';

@Injectable()
export class GamesService {
  constructor(
    @Inject('IGamesRepository')
    private readonly gameRepository: IGamesRepository,
  ) {}

  create(createGameDto: CreateGameDto) {
    const newGame = this.gameRepository.create(createGameDto);
    return this.gameRepository.save(newGame);
  }

  findAll(page = 1, limit = 10) {
    return this.gameRepository.find(page, limit);
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
