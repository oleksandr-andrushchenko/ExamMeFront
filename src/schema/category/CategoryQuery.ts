import Pagination from '../../types/pagination/Pagination'

export default interface CategoryQuery extends Pagination {
  category?: string
  completion?: boolean
}