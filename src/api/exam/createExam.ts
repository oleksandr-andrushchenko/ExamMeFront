import client from '../client'
import ExamTransfer from '../../schema/exam/ExamTransfer'
import Exam from '../../schema/exam/Exam'

export default async (transfer: ExamTransfer): Promise<Exam> => (await client.post('/exams', transfer)).data