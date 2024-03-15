import client from '../client'
import Question from '../../schema/Question'
import QuestionTransfer from '../../schema/QuestionTransfer'

export default async (id: string, transfer: QuestionTransfer): Promise<Question> => await client.put(`/questions/${ id }`, transfer)