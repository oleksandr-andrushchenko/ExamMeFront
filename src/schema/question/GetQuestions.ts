import Pagination from '../pagination/Pagination'

export default interface GetQuestions extends Pagination {
  categoryId?: string
  price?: string
  search?: string
  difficulty?: string
  type?: string
}