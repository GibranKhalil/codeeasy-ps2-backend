import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { eSnippetEngine } from 'src/@types/enums/eSnippetEngine.enum';
import type { eSnippetLanguage } from 'src/@types/enums/eSnippetLanguage.enum';
import type { User } from 'src/models/users/entities/user.entity';

export class CreateSnippetDto {
  title: string;
  description: string;
  code: string;
  language: eSnippetLanguage;
  creatorId?: number; // esse campo vem do front e não é opcional
  creator?: User; // esse campo não vem do front, é preenchido pelo service
  engine?: eSnippetEngine;
  status?: eContentStatus;
  tags?: string[];
}
