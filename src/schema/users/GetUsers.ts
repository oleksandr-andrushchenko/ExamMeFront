import Pagination from '../pagination/Pagination'

export default interface GetUsers extends Pagination {
  search?: string
}