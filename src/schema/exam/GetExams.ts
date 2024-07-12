import Pagination from '../pagination/Pagination'

export default interface GetExams extends Pagination {
  categoryId?: string
  completion?: boolean
}