export interface IGenericRepository<FINDALL, FIND, CREATE, UPDATE, ENTITY> {
  find(page: number, limit: number): Promise<FINDALL>;
  findOneBy(options: object): Promise<FIND | null>;
  save(entity: CREATE): Promise<ENTITY>;
  create(entity: CREATE): ENTITY;
  update(id: number, entity: UPDATE): Promise<void>;
  delete(id: number): Promise<void>;
}
