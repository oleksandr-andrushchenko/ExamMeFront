import client from '../client'
import Category from '../../schema/category/Category'
import CategoryTransfer from '../../schema/category/CategoryTransfer'

export default async (transfer: CategoryTransfer): Promise<Category> => (await client.post('/categories', transfer)).data