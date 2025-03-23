import { PaginationMeta } from './iPaginationMeta.interface';

export interface IPaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
