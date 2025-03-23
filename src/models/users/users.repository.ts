import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import type { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private repository = this.dataSource.getRepository(User);

  constructor(private readonly dataSource: DataSource) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findByGithubId(githubId: string): Promise<User | null> {
    return this.repository.findOne({ where: { githubId } });
  }

  create(user: Partial<User>): User {
    return this.repository.create(user);
  }

  async save(user: Partial<User>): Promise<User> {
    return this.repository.save(user);
  }

  async find(page = 1, limit = 10): Promise<IPaginatedResult<User>> {
    const queryBuilder = this.repository.createQueryBuilder('user');

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findOneBy(options: object): Promise<User | null> {
    return this.repository.findOne({ where: options });
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<void> {
    await this.repository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
