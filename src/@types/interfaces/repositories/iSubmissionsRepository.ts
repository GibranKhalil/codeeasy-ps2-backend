import { Submission } from 'src/models/submissions/entities/submission.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { CreateSubmissionDto } from 'src/models/submissions/dto/create-submission.dto';
import { UpdateSubmissionDto } from 'src/models/submissions/dto/update-submission.dto';

export interface ISubmissionsRepository
  extends IGenericRepository<
    Submission,
    Submission,
    CreateSubmissionDto,
    UpdateSubmissionDto,
    Submission
  > {
  findPending(): Promise<Submission[]>;
  findByType(type: Submission['type']): Promise<Submission[]>;
  findByStatus(status: Submission['status']): Promise<Submission[]>;

  updateStatusAndComment(
    id: number,
    status: Submission['status'],
    comment?: string,
  ): Promise<Submission>;

  findByContentId(contentId: number): Promise<Submission | null>;
}
