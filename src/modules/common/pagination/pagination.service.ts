import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_PREFIX } from 'src/shared/constants';

type GetPagination = {
  page: number;
  take: number;
  totalOfItems: number;
  route: string;
};

@Injectable()
export class PaginationService {
  constructor(private configService: ConfigService) {}

  getPagination({ page, take, totalOfItems, route }: GetPagination) {
    const host = this.configService.get('infra.host');
    const totalOfPages = Math.ceil(totalOfItems / take);
    const nextSkip = (page - 1) * take;

    const nextPage =
      page === totalOfPages || totalOfPages === 0 ? null : page + 1;

    const nextPageUrl = nextPage
      ? `${host}${GLOBAL_PREFIX}${route}?page=${nextPage}&take=${take}`
      : null;

    const prevPage = page === 1 ? null : page - 1;

    const prevPageUrl = prevPage
      ? `${host}${GLOBAL_PREFIX}${route}?page=${prevPage}&take=${take}`
      : null;

    return {
      nextSkip,
      totalOfPages,
      nextPageUrl,
      prevPageUrl,
    };
  }
}
