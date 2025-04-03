import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { RolesRepository } from '../roles/roles.repository';
import { StorageService } from '../storage/storage.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    StorageService,
    { provide: 'IUsersRepository', useClass: UsersRepository },
    { provide: 'IRoleRepository', useClass: RolesRepository },
  ],
})
export class UsersModule {}
