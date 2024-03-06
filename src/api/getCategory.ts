import client from './client'
import Category from '../schema/Category'

export default async (categoryId: string): Promise<Category> => (await client.get(`/categories/${categoryId}`)).data