import client from '../client'
import Pagination from '../../types/pagination/Pagination'
import Paginated from '../../types/pagination/Paginated'
import Exam from '../../schema/exam/Exam'

export default async (categoryId: string, pagination: Pagination | URLSearchParams = {}): Promise<Paginated<Exam>> => {
  const config = { params: { ...{ category: categoryId }, ...pagination } }

  return (await client.get('/exams', config)).data
}