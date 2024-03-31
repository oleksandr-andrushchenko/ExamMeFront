import client from '../client'
import Question from '../../schema/question/Question'
import Pagination from '../../types/pagination/Pagination'
import Paginated from '../../types/pagination/Paginated'

export default async (categoryId: string, pagination: Pagination | URLSearchParams = {}): Promise<Paginated<Question>> => {
  const config = { params: pagination }

  return (await client.get(`/categories/${ categoryId }/questions`, config)).data
}