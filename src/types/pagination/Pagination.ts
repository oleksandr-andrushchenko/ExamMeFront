export default class Pagination {
  prevCursor?: string
  nextCursor?: string
  cursor?: string = 'id'
  size?: string = '20'
  order?: 'asc' | 'desc' = 'desc'
}