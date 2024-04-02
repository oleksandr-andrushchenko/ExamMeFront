import client from '../client'
import ExamQuestion from '../../schema/exam/ExamQuestion'

export default async (examId: string, questionId: string): Promise<ExamQuestion> => {
  return (await client.get(`/exams/${ examId }/question/${ questionId }`)).data
}