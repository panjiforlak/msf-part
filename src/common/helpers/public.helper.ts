interface Pagination {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export function paginateResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Retrieve data success',
  statusCode = 200,
) {
  const pagination: Pagination = {
    total,
    page,
    limit,
    lastPage: Math.ceil(total / limit),
  };

  return {
    statusCode,
    message,
    data,
    pagination,
  };
}
