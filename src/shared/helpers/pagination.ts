import { HOST } from '../constants';

type GetPagination = {
  page: number;
  take: number;
  totalOfItems: number;
  route: string;
};

export function getPagination({
  page,
  take,
  totalOfItems,
  route,
}: GetPagination) {
  const totalOfPages = Math.ceil(totalOfItems / take);
  const nextSkip = (page - 1) * take;

  const nextPage =
    page === totalOfPages || totalOfPages === 0 ? null : page + 1;

  const nextPageUrl = nextPage
    ? `${HOST}${route}?page=${nextPage}&take=${take}`
    : null;

  const prevPage = page === 1 ? null : page - 1;

  const prevPageUrl = prevPage
    ? `${HOST}${route}?page=${prevPage}&take=${take}`
    : null;

  return {
    nextSkip,
    totalOfPages,
    nextPageUrl,
    prevPageUrl,
  };
}
