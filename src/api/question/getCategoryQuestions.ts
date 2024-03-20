import client from '../client'
import Question from '../../schema/Question'
import { AxiosRequestConfig } from 'axios'

export default async (categoryId: string, cursor: string = 'id', size: number = 20, order: 'asc' | 'desc' = 'desc'): Promise<Question[]> => {
  const params = { cursor, size, order }
  const response = await client.get(`/categories/${ categoryId }/questions`, { params } as AxiosRequestConfig)

  return response.data.data
}