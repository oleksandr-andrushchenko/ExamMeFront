import Pagination from '../pagination/Pagination'

export default interface CategoryQuery extends Pagination {
  price?: string
  search?: string
}