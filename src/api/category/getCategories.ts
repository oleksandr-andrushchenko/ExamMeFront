import client from '../client'
import Category from '../../schema/Category'
import { AxiosRequestConfig } from 'axios'

export default async (cursor: string = 'id', size: number = 20, order: 'asc' | 'desc' = 'desc'): Promise<Category[]> => {
  const params = { cursor, size, order }
  const response = await client.get('/categories', { params } as AxiosRequestConfig)

  return response.data.data
}