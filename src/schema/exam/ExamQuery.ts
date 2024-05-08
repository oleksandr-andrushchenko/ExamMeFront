import Pagination from '../../types/pagination/Pagination.ts'

export default interface ExamQuery extends Pagination {
  category?: string
  completion?: boolean
}