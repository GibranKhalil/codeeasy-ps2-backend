import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import type { IUsersRepository } from 'src/@types/interfaces/repositories/iUserRepository.interface';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';
import { PaginationParams } from 'src/@types/paginationParams.type';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private repository = this.dataSource.getRepository(User);

  constructor(private readonly dataSource: DataSource) {}

  async findUserWithRoles(
    identifier: {
      id?: number;
      email?: string;
      pid?: string;
      username?: string;
    },
    password?: {
      withPassword: boolean;
    },
  ): Promise<User | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.pid',
        'user.username',
        'user.email',
        'user.bio',
        'user.lastLoginAt',
        'user.avatarUrl',
        'user.createdAt',
        'user.updatedAt',
        'user.website',
        'user.linkedin',
        'user.github',
        'user.coverImageUrl',
        'user.dailyDev',
        'user.twitter',
      ])
      .leftJoinAndSelect('user.roles', 'roles');

    if (password?.withPassword) {
      queryBuilder.addSelect('user.password');
    }

    if (identifier.id) {
      queryBuilder.where('user.id = :id', { id: identifier.id });
    } else if (identifier.email) {
      queryBuilder.where('user.email = :email', { email: identifier.email });
    } else if (identifier.pid) {
      queryBuilder.where('user.pid = :pid', { pid: identifier.pid });
    } else if (identifier.username) {
      queryBuilder.where('user.username :username', {
        username: identifier.username,
      });
    } else {
      throw new BadRequestException(
        'Envie o id, email ou pid do usuário para realizar a busca',
      );
    }

    return queryBuilder.getOne();
  }

  async findAllWithRoles(
    pagination: PaginationParams,
  ): Promise<IPaginatedResult<User>> {
    const { limit = 10, page = 1 } = pagination;

    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.pid',
        'user.username',
        'user.email',
        'user.bio',
        'user.lastLoginAt',
        'user.avatarUrl',
        'user.createdAt',
        'user.updatedAt',
        'user.website',
        'user.linkedin',
        'user.github',
      ])
      .leftJoinAndSelect('user.roles', 'roles')
      .skip((page - 1) * limit)
      .take(limit);

    const total = await queryBuilder.getCount();
    const data = await queryBuilder.getMany();
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
    return this.repository.findOne({
      where: options,
      select: {
        avatarUrl: true,
        bio: true,
        email: true,
        games: true,
        github: true,
        website: true,
        linkedin: true,
        lastLoginAt: true,
        pid: true,
        roles: true,
        username: true,
        githubId: true,
        tutorials: true,
        snippetModifiers: true,
        snippetLastModifier: true,
        snippets: true,
        createdAt: true,
        updatedAt: true,
        id: true,
        coverImageUrl: true,
      },
    });
  }

  async findOne(options: object): Promise<User | null> {
    return this.repository.findOne(options);
  }

  async update(
    id: number,
    updateUserDto: Partial<User>,
  ): Promise<UpdateResult> {
    return await this.repository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
