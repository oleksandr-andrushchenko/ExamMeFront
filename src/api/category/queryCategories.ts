import client from '../client'
import Category from '../../schema/Category'
import Pagination from '../../types/pagination/Pagination'
import Paginated from '../../types/pagination/Paginated'

export default async (pagination: Pagination | URLSearchParams = {}): Promise<Paginated<Category>> => {
  const config = { params: pagination }

  return (await client.get('/categories', config)).data
}