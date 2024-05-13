import Pagination from '../pagination/Pagination'

export default interface ExamQuery extends Pagination {
  categoryId?: string
  completion?: boolean
}