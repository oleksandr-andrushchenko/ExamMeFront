import client from '../client'
import Exam from '../../schema/exam/Exam.ts'

export default async (examId: string): Promise<Exam> => (await client.post(`/exams/${ examId }/completion`)).data