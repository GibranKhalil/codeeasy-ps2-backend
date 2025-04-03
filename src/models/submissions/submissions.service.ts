import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';
import { PaginationParams } from 'src/@types/paginationParams.type';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { Submission } from './entities/submission.entity';
import { IContentStatusUpdater } from 'src/@types/interfaces/factory/iContentStatusUpdater.interface';
import { GameStatusUpdater } from '../games/updaters/game-status.updater';
import { SnippetStatusUpdater } from '../snippet/updaters/snippet-status.updater';
import { TutorialStatusUpdater } from '../tutorial/updaters/tutorial-status.updater';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    @Inject('ISubmissionsRepository')
    private readonly submissionRepository: ISubmissionsRepository,
    private readonly gameStatusUpdater: GameStatusUpdater,
    private readonly snippetStatusUpdater: SnippetStatusUpdater,
    private readonly tutorialStatusUpdater: TutorialStatusUpdater,
  ) {}

  create(createSubmissionDto: CreateSubmissionDto) {
    const newSubmission = this.submissionRepository.create(createSubmissionDto);

    return this.submissionRepository.save(newSubmission);
  }

  findAll(pagination: PaginationParams) {
    return this.submissionRepository.find(pagination.page, pagination.limit);
  }

  findOne(id: number) {
    return this.submissionRepository.findOneBy({ id });
  }

  async update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return this.submissionRepository.update(id, updateSubmissionDto);
  }

  async resolveSubmission(
    id: number,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<Submission> {
    const submission = await this.findSubmissionById(id);
    this.validateStatus(updateSubmissionDto.status as eContentStatus);

    const { updater, pid } = this.getUpdaterAndPid(updateSubmissionDto) as {
      updater: IContentStatusUpdater;
      pid: string;
    };

    if (!updater || !pid) {
      this.logAndThrowInvalidContent();
    }

    return this.processSubmissionResolution(
      submission,
      updater,
      pid,
      updateSubmissionDto,
    );
  }

  private async findSubmissionById(id: number): Promise<Submission> {
    const submission = await this.submissionRepository.findOneBy({ id });
    if (!submission) {
      throw new NotFoundException(`Submissão com ID ${id} não encontrada.`);
    }
    return submission;
  }

  private validateStatus(status: eContentStatus): void {
    const validStatuses = [
      eContentStatus.APPROVED,
      eContentStatus.REJECTED,
      eContentStatus.PENDING,
    ];
    if (!validStatuses.includes(status)) {
      this.logger.error(`Status inválido fornecido no DTO: ${status}`);
      throw new BadRequestException(
        `Status inválido: ${status}. Deve ser '${eContentStatus.APPROVED}', '${eContentStatus.REJECTED}' ou '${eContentStatus.PENDING}'.`,
      );
    }
  }

  private getUpdaterAndPid(
    dto: UpdateSubmissionDto,
  ): { updater: IContentStatusUpdater; pid: string } | null {
    if (dto.game?.pid) {
      return { updater: this.gameStatusUpdater, pid: dto.game.pid };
    }
    if (dto.snippet?.pid) {
      return { updater: this.snippetStatusUpdater, pid: dto.snippet.pid };
    }
    if (dto.tutorial?.pid) {
      return { updater: this.tutorialStatusUpdater, pid: dto.tutorial.pid };
    }
    return null;
  }

  private logAndThrowInvalidContent(): never {
    throw new BadRequestException(
      'Nenhum conteúdo (game, snippet, tutorial) foi fornecido para atualização.',
    );
  }

  private async processSubmissionResolution(
    submission: Submission,
    updater: IContentStatusUpdater,
    pid: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<Submission> {
    await updater.updateStatus(
      pid,
      updateSubmissionDto.status as eContentStatus,
    );

    submission.status = updateSubmissionDto.status as eContentStatus;
    submission.resolvedAt = new Date();

    if (updateSubmissionDto.comment) {
      submission.comment = updateSubmissionDto.comment;
    }

    const updatedSubmission = await this.submissionRepository.save(submission);
    return updatedSubmission;
  }

  remove(id: number) {
    return this.submissionRepository.delete(id);
  }
}
