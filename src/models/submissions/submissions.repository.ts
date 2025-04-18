import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { ISubmissionsRepository } from 'src/@types/interfaces/repositories/iSubmissionsRepository';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';
import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';

@Injectable()
export class SubmissionsRepository implements ISubmissionsRepository {
  private repository = this.dataSource.getRepository(Submission);

  constructor(private readonly dataSource: DataSource) {}

  async findPending(): Promise<Submission[]> {
    return this.repository.find({
      where: {
        status: eContentStatus.PENDING,
      },
    });
  }

  async findByType(type: Submission['type']): Promise<Submission[]> {
    return this.repository.find({
      where: {
        type,
      },
    });
  }

  async findByStatus(status: Submission['status']): Promise<Submission[]> {
    return this.repository.find({
      where: {
        status,
      },
    });
  }

  async findOne(options: object): Promise<Submission | null> {
    return this.repository.findOne(options);
  }

  async updateStatusAndComment(
    id: number,
    status: Submission['status'],
    comment?: string,
  ): Promise<Submission> {
    const submission = await this.repository.findOneBy({ id });

    if (!submission) {
      throw new Error(`Submission with id ${id} not found`);
    }

    submission.status = status;
    if (comment !== undefined) {
      submission.comment = comment;
    }

    return this.repository.save(submission);
  }

  async findByContentId(contentId: number): Promise<Submission | null> {
    return this.repository.findOneBy({ id: contentId });
  }

  async find(page = 1, limit = 10): Promise<IPaginatedResult<Submission>> {
    const queryBuilder = this.repository
      .createQueryBuilder('submission')
      .select([
        'submission.id',
        'submission.comment',
        'submission.status',
        'submission.title',
        'submission.submittedAt',
        'submission.type',
        'submission.resolvedAt',
        'game.pid',
        'game.description',
        'game.version',
        'game.fileSize',
        'game.excerpt',
        'game.screenshots',
        'game.tags',
        'snippet.pid',
        'snippet.code',
        'snippet.language',
        'tutorial.pid',
        'tutorial.content',
        'tutorial.tags',
        'tutorial.excerpt',
        'tutorial.readTime',
        'creator.username',
        'creator.avatarUrl',
        'creator.email',
        'creator.pid',
        'gameCategory.id',
        'gameCategory.name',
        'tutorialCategory.id',
        'tutorialCategory.name',
      ])
      .leftJoin('submission.game', 'game')
      .leftJoin('submission.snippet', 'snippet')
      .leftJoin('submission.tutorial', 'tutorial')
      .leftJoin('submission.creator', 'creator')
      .leftJoin('game.category', 'gameCategory')
      .leftJoin('tutorial.category', 'tutorialCategory')
      .orderBy('submission.submittedAt', 'DESC');

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findOneBy(options: object): Promise<Submission | null> {
    return this.repository.findOneBy(options);
  }

  async save(entity: CreateSubmissionDto): Promise<Submission> {
    const submission = this.repository.create(entity);
    return this.repository.save(submission);
  }

  create(entity: CreateSubmissionDto): Submission {
    return this.repository.create(entity);
  }

  async update(id: number, entity: UpdateSubmissionDto): Promise<UpdateResult> {
    return await this.repository.update(id, entity);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
