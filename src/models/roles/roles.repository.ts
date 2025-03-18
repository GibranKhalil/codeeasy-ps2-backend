import { Injectable } from '@nestjs/common';
import { IRoleRepository } from 'src/@types/interfaces/repositories/iRolesRepository.interface';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesRepository implements IRoleRepository {
  private repository = this.dataSource.getRepository(Role);

  constructor(private readonly dataSource: DataSource) {}

  async find(): Promise<Role[]> {
    return await this.repository.find();
  }

  async findOneBy(options: object): Promise<Role | null> {
    return await this.repository.findOne({ where: options });
  }

  async save(entity: CreateRoleDto): Promise<Role> {
    return await this.repository.save(entity);
  }

  create(entity: CreateRoleDto): Role {
    return this.repository.create(entity);
  }

  async update(id: number, entity: UpdateRoleDto): Promise<void> {
    await this.repository.update(id, entity);
  }
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
