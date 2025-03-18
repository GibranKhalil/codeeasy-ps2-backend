import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    { provide: 'IRoleRepository', useClass: RolesRepository },
  ],
})
export class RolesModule {}
