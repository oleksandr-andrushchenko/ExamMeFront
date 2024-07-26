import Pagination from '../pagination/Pagination'
import YesNo from '../../enum/YesNo'

export default interface GetCategories extends Pagination {
  subscription?: YesNo
  approved?: YesNo
  search?: string
}