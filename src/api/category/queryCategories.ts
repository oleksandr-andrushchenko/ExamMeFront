import client from '../client'
import Category from '../../schema/category/Category'
import Paginated from '../../types/pagination/Paginated'
import CategoryQuery from '../../schema/category/CategoryQuery'

export default async (pagination: CategoryQuery | URLSearchParams = {}): Promise<Paginated<Category>> => {
  const config = { params: pagination }

  return (await client.get('/categories', config)).data
}