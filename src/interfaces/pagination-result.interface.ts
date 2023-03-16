export interface PaginationResult<T = unknown> {
  data: T[]
  total: number
  skip: number
  take: number
}
