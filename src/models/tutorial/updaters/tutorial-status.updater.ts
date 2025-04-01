import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { IContentStatusUpdater } from 'src/@types/interfaces/factory/iContentStatusUpdater.interface';
import { Tutorial } from '../entities/tutorial.entity';

@Injectable()
export class TutorialStatusUpdater implements IContentStatusUpdater {
  private readonly logger = new Logger(TutorialStatusUpdater.name);

  constructor(
    @InjectRepository(Tutorial)
    private readonly tutorialRepository: Repository<Tutorial>,
  ) {}

  async updateStatus(
    pid: string,
    status: eContentStatus,
  ): Promise<UpdateResult> {
    const entity = await this.findTutorialByPid(pid);
    if (!entity) return this.logAndThrowNotFound(pid);

    return this.performUpdate(entity.id, status, pid);
  }

  private async findTutorialByPid(pid: string) {
    return this.tutorialRepository.findOneBy({ pid });
  }

  private logAndThrowNotFound(pid: string): never {
    this.logger.warn(`Tutorial com PID ${pid} não encontrado.`);
    throw new NotFoundException(`Tutorial com PID ${pid} não encontrado.`);
  }

  private async performUpdate(
    id: number,
    status: eContentStatus,
    pid: string,
  ): Promise<UpdateResult> {
    const updateResult = await this.tutorialRepository.update(id, { status });

    if (!updateResult.affected || updateResult.affected <= 0) {
      return this.logAndThrowUpdateError(id, pid, status);
    }

    this.logger.log(
      `Status do Tutorial ${id} (PID: ${pid}) atualizado para ${status}.`,
    );
    return updateResult;
  }

  private logAndThrowUpdateError(
    id: number,
    pid: string,
    status: eContentStatus,
  ): never {
    this.logger.error(
      `Falha ao atualizar status do Tutorial ${id} (PID: ${pid}) para ${status}. Nenhum registro afetado.`,
    );
    throw new InternalServerErrorException(
      'Não foi possível atualizar o status do tutorial.',
    );
  }
}
