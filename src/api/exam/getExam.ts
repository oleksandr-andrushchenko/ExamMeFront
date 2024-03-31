import client from '../client'
import Exam from '../../schema/exam/Exam'

export default async (examId: string): Promise<Exam> => (await client.get(`/exams/${ examId }`)).data