import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { IContentStatusUpdater } from 'src/@types/interfaces/factory/iContentStatusUpdater.interface';
import { IGamesRepository } from 'src/@types/interfaces/repositories/iGamesRepository.interface';
import { Game } from '../entities/game.entity';

@Injectable()
export class GameStatusUpdater implements IContentStatusUpdater {
  private readonly logger = new Logger(GameStatusUpdater.name);

  constructor(
    @Inject('IGamesRepository')
    private readonly gameRepository: IGamesRepository,
  ) {}

  async updateStatus(pid: string, status: eContentStatus) {
    const entity = await this.findGameByPid(pid);
    if (!entity) return this.logAndThrowNotFound(pid);
    return this.performUpdate(entity.id, status, pid);
  }

  private async findGameByPid(pid: string): Promise<Game | null> {
    return this.gameRepository.findOneBy({ pid });
  }

  private logAndThrowNotFound(pid: string): never {
    this.logger.warn(`Game com PID ${pid} não encontrado.`);
    throw new NotFoundException(`Jogo com PID ${pid} não encontrado.`);
  }

  private async performUpdate(id: number, status: eContentStatus, pid: string) {
    const updateResult = await this.gameRepository.update(id, { status });

    if (!updateResult.affected || updateResult.affected <= 0) {
      return this.logAndThrowUpdateError(id, pid, status);
    }

    this.logger.log(
      `Status do Jogo ${id} (PID: ${pid}) atualizado para ${status}.`,
    );
    return updateResult;
  }

  private logAndThrowUpdateError(
    id: number,
    pid: string,
    status: eContentStatus,
  ): never {
    this.logger.error(
      `Falha ao atualizar status do Jogo ${id} (PID: ${pid}) para ${status}.`,
    );
    throw new InternalServerErrorException(
      'Não foi possível atualizar o status do jogo.',
    );
  }
}
