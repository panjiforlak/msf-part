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

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // ganti spasi & underscore dengan -
    .replace(/[^\w-]+/g, '') // hapus karakter selain huruf/angka/-
    .replace(/--+/g, '-'); // hilangkan double --
}

export function getResetCountdown(expire: string) {
  const expireDate = new Date(expire);
  const now = new Date();

  const diffMs = expireDate.getTime() - now.getTime();

  if (diffMs <= 0) return 'Expired';

  const minutes = Math.floor(diffMs / 1000 / 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return `${minutes}m ${seconds}s remaining`;
}
