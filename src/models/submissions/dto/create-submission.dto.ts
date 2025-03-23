import { SubmissionType } from '../entities/submission.entity';

export class CreateSubmissionDto {
  type: SubmissionType;
  snippetId?: string;
  tutorialId?: string;
  gameId?: string;
  comment?: string;
}
