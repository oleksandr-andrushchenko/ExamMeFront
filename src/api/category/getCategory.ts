import client from '../client'
import Category from '../../schema/category/Category'

export default async (categoryId: string): Promise<Category> => (await client.get(`/categories/${ categoryId }`)).data