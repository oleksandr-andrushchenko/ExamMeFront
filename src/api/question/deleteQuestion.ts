import client from '../client'

export default async (questionId: string): Promise<any> => (await client.delete(`/questions/${ questionId }`)).data