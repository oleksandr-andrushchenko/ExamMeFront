import client from '../client'
import ExamQuestion from '../../schema/exam/ExamQuestion'

export default async (examId: string, question: number): Promise<ExamQuestion> => {
  return (await client.get(`/exams/${ examId }/questions/${ question }`)).data
}