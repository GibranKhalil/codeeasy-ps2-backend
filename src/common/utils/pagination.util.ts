import { PaginatedResponse } from '../interfaces/pagination.interface';

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  baseUrl?: string,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  const response: PaginatedResponse<T> = {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };

  if (baseUrl) {
    response.links = {
      first: `${baseUrl}?page=1&limit=${limit}`,
      last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
    };

    if (page > 1) {
      response.links.previous = `${baseUrl}?page=${page - 1}&limit=${limit}`;
    }

    if (page < totalPages) {
      response.links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
    }
  }

  return response;
}