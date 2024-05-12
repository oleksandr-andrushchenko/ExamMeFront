import Pagination from '../../types/pagination/Pagination'

export default interface CategoryQuery extends Pagination {
  price?: string
  search?: string
}