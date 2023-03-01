export interface Pagination<T> {
  info: {
    nextPageUrl: string;
    prevPageUrl: string;
    totalOfItems: number;
    totalOfPages: number;
  };
  results: T;
}
