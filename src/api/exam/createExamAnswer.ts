import client from '../client'
import ExamQuestion from '../../schema/exam/ExamQuestion'

export default async (examId: string, questionId: string, answer: string | number): Promise<ExamQuestion> => {
  return (await client.post(`/exams/${ examId }/question/${ questionId }/answer`, { answer })).data
}