import Pagination from '../../types/pagination/Pagination'

export default interface ExamQuery extends Pagination {
  category?: string
  completion?: boolean
}