import client from '../client'

export default async (examId: string): Promise<any> => (await client.delete(`/exams/${ examId }`)).data