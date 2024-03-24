import client from '../client'
import Category from '../../schema/Category'
import Pagination from '../../types/pagination/Pagination'
import Paginated from '../../types/pagination/Paginated'

export default async (pagination: Pagination = {}): Promise<Paginated<Category>> => (await client.get('/categories', { params: pagination })).data