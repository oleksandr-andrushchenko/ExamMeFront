import Pagination from '../pagination/Pagination'

export default interface GetQuestions extends Pagination {
  category?: string
  price?: string
  search?: string
  difficulty?: string
  type?: string
}