import client from '../client'
import Question from '../../schema/Question'
import Pagination from '../../types/pagination/Pagination'
import Paginated from '../../types/pagination/Paginated'

export default async (pagination: Pagination | URLSearchParams = {}): Promise<Paginated<Question>> => {
  const config = { params: pagination }

  return (await client.get('/questions', config)).data
}