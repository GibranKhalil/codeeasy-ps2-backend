import type { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import type { UpdateUserDto } from 'src/models/users/dto/update-user.dto';
import type { User } from 'src/models/users/entities/user.entity';
import type { IGenericRepository } from '../common/iGenericRepository.interface';

export interface IUsersRepository
  extends IGenericRepository<User, User, CreateUserDto, UpdateUserDto, User> {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByGithubId(githubId: string): Promise<User | null>;
}
