import { Role } from 'src/models/roles/entities/role.entity';
import { IGenericRepository } from '../common/iGenericRepository.interface';
import { CreateRoleDto } from 'src/models/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/models/roles/dto/update-role.dto';
import { IPaginatedResult } from '../common/iPaginatedResult.interface';

export type IRoleRepository = IGenericRepository<
  IPaginatedResult<Role>,
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  Role
>;
