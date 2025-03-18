import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    { provide: 'IUsersRepository', useClass: UsersRepository },
  ],
})
export class UsersModule {}
