import Pagination from '../pagination/Pagination'

export default interface GetCategories extends Pagination {
  price?: string
  search?: string
}