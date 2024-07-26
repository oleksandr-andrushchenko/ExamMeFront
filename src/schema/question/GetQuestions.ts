import Pagination from '../pagination/Pagination'
import YesNo from '../../enum/YesNo'

export default interface GetQuestions extends Pagination {
  category?: string
  subscription?: YesNo
  approved?: YesNo
  search?: string
  difficulty?: string
  type?: string
}