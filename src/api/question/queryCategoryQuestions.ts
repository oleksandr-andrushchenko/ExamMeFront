import client from '../client'
import Question from '../../schema/Question'
import Pagination from '../../types/pagination/Pagination'
import Paginated from '../../types/pagination/Paginated'

export default async (categoryId: string, pagination: Pagination = {}): Promise<Paginated<Question>> => (await client.get(`/categories/${ categoryId }/questions`, { params: pagination })).data