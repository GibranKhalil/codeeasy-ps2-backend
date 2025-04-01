import { Injectable } from '@nestjs/common';
import { IRoleRepository } from 'src/@types/interfaces/repositories/iRolesRepository.interface';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IPaginatedResult } from 'src/@types/interfaces/common/iPaginatedResult.interface';

@Injectable()
export class RolesRepository implements IRoleRepository {
  private repository = this.dataSource.getRepository(Role);

  constructor(private readonly dataSource: DataSource) {}

  async find(page = 1, limit = 10): Promise<IPaginatedResult<Role>> {
    const queryBuilder = this.repository.createQueryBuilder('role');

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

  async findOneBy(options: object): Promise<Role | null> {
    return await this.repository.findOne({ where: options });
  }

  async findOne(options: object): Promise<Role | null> {
    return await this.repository.findOne(options);
  }

  async save(entity: CreateRoleDto): Promise<Role> {
    return await this.repository.save(entity);
  }

  create(entity: CreateRoleDto): Role {
    return this.repository.create(entity);
  }

  async update(id: number, entity: UpdateRoleDto): Promise<UpdateResult> {
    return await this.repository.update(id, entity);
  }
  async delete(id: number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
