export default class Pagination {
  prevCursor?: string
  nextCursor?: string
  cursor?: string = 'id'
  size?: string | number = '20'
  order?: 'asc' | 'desc' = 'desc'
}