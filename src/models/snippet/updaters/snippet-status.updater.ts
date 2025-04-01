import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { IContentStatusUpdater } from 'src/@types/interfaces/factory/iContentStatusUpdater.interface';
import { ISnippetRepository } from 'src/@types/interfaces/repositories/iSnippetRepository.interface';
import { UpdateResult } from 'typeorm';

@Injectable()
export class SnippetStatusUpdater implements IContentStatusUpdater {
  private readonly logger = new Logger(SnippetStatusUpdater.name);

  constructor(
    @Inject('ISnippetRepository')
    private readonly snippetRepository: ISnippetRepository,
  ) {}

  async updateStatus(
    pid: string,
    status: eContentStatus,
  ): Promise<UpdateResult> {
    const entity = await this.findSnippetByPid(pid);
    if (!entity) return this.logAndThrowNotFound(pid);

    return this.performUpdate(entity.id, status, pid);
  }

  private async findSnippetByPid(pid: string) {
    return this.snippetRepository.findOneBy({ pid });
  }

  private logAndThrowNotFound(pid: string): never {
    this.logger.warn(`Snippet com PID ${pid} não encontrado.`);
    throw new NotFoundException(`Snippet com PID ${pid} não encontrado.`);
  }

  private async performUpdate(
    id: number,
    status: eContentStatus,
    pid: string,
  ): Promise<UpdateResult> {
    const updateResult = await this.snippetRepository.update(id, { status });

    if (!updateResult.affected || updateResult.affected <= 0) {
      return this.logAndThrowUpdateError(id, pid, status);
    }

    this.logger.log(
      `Status do Snippet ${id} (PID: ${pid}) atualizado para ${status}.`,
    );
    return updateResult;
  }

  private logAndThrowUpdateError(
    id: number,
    pid: string,
    status: eContentStatus,
  ): never {
    this.logger.error(
      `Falha ao atualizar status do Snippet ${id} (PID: ${pid}) para ${status}. Nenhum registro afetado.`,
    );
    throw new InternalServerErrorException(
      'Não foi possível atualizar o status do snippet.',
    );
  }
}
