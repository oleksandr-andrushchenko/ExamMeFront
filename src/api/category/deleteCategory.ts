import client from '../client'

export default async (categoryId: string): Promise<any> => (await client.delete(`/categories/${ categoryId }`)).data