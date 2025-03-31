import type { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import type { UpdateUserDto } from 'src/models/users/dto/update-user.dto';
import type { User } from 'src/models/users/entities/user.entity';
import type { IGenericRepository } from '../common/iGenericRepository.interface';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';
import { PaginationParams } from 'src/@types/paginationParams.type';

export interface IUsersRepository
  extends IGenericRepository<
    IPaginatedResult<User>,
    User,
    CreateUserDto,
    UpdateUserDto,
    User
  > {
  findUserWithRoles(
    identifier: {
      id?: number;
      email?: string;
      pid?: string;
      username?: string;
    },
    password?: {
      withPassword?: boolean;
    },
  ): Promise<User | null>;
  findByGithubId(githubId: string): Promise<User | null>;
  findAllWithRoles(
    pagination: PaginationParams,
  ): Promise<IPaginatedResult<User>>;
  findOne(options: object): Promise<User | null>;
}
