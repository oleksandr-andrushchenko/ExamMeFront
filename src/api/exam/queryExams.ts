import client from '../client'
import Paginated from '../../types/pagination/Paginated'
import Exam from '../../schema/exam/Exam'
import ExamQuery from '../../schema/exam/ExamQuery'

export default async (query: ExamQuery | URLSearchParams = {}): Promise<Paginated<Exam>> => {
  const config = { params: query }

  return (await client.get('/exams', config)).data
}