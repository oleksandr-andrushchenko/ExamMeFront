import client from '../client'
import ExamQuestion from '../../schema/exam/ExamQuestion'
import ExamQuestionAnswerTransfer from '../../schema/exam/ExamQuestionAnswerTransfer'

export default async (examId: string, question: number, transfer: ExamQuestionAnswerTransfer): Promise<ExamQuestion> => {
  return (await client.post(`/exams/${ examId }/questions/${ question }/answer`, transfer)).data
}