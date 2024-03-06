import client from './client'
import Category from '../schema/Category'

export default async (): Promise<Category[]> => (await client.get('/categories')).data