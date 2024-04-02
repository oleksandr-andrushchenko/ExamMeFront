import client from '../client'
import ExamQuestion from '../../schema/exam/ExamQuestion'

export default async (examId: string): Promise<ExamQuestion> => {
  return (await client.get(`/exams/${ examId }/current-question`)).data
}