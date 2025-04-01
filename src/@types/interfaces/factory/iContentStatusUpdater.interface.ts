import { eContentStatus } from 'src/@types/enums/eContentStatus.enum';
import { UpdateResult } from 'typeorm';

export interface IContentStatusUpdater {
  updateStatus(pid: string, status: eContentStatus): Promise<UpdateResult>;
}
