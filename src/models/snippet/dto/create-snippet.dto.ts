import { eSnippetEngine } from 'src/@types/enums/eSnippetEngine.enum';
import type { eSnippetLanguage } from 'src/@types/enums/eSnippetLanguage.enum';

export class CreateSnippetDto {
  title: string;
  description: string;
  code: string;
  language: eSnippetLanguage;
  creatorId: number;
  engine?: eSnippetEngine;
}
