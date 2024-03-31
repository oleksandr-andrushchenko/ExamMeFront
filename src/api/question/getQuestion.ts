import client from '../client'
import Question from '../../schema/question/Question'

export default async (questionId: string): Promise<Question> => (await client.get(`/questions/${ questionId }`)).data