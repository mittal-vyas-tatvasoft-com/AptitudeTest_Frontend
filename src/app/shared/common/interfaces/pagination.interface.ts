export interface Pagination<T> {
  entityList: T[];
  currentPageIndex: number;
  isPreviousPage?: boolean;
  isNextPage?: boolean;
  pageCount?: number;
  pageSize: number;
  totalItemsCount?: number;
}
