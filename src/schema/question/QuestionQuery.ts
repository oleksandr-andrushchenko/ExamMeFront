import Pagination from '../../types/pagination/Pagination'

export default interface QuestionQuery extends Pagination {
  categoryId?: string
  price?: string
  search?: string
  difficulty?: string
  type?: string
}