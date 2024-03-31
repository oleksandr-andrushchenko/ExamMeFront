import client from '../client'
import Question from '../../schema/question/Question'
import QuestionTransfer from '../../schema/question/QuestionTransfer'

export default async (transfer: QuestionTransfer): Promise<Question> => (await client.post('/questions', transfer)).data