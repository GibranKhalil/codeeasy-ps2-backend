import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsRepository } from './submissions.repository';

@Module({
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    { provide: 'ISubmissionsRepository', useClass: SubmissionsRepository },
  ],
})
export class SubmissionsModule {}
