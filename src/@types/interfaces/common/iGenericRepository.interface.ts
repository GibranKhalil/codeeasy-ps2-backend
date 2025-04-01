import { DeleteResult, UpdateResult } from 'typeorm';

export interface IGenericRepository<FINDALL, FIND, CREATE, UPDATE, ENTITY> {
  find(page: number, limit: number): Promise<FINDALL>;
  findOneBy(options: object): Promise<FIND | null>;
  findOne(options: object): Promise<FIND | null>;
  save(entity: CREATE): Promise<ENTITY>;
  create(entity: CREATE): ENTITY;
  update(id: number, entity: UPDATE): Promise<UpdateResult>;
  delete(id: number): Promise<DeleteResult>;
}
