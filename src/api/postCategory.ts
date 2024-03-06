import client from './client'
import Category from '../schema/Category'
import CategoryTransfer from '../schema/CategoryTransfer'

export default async (transfer: CategoryTransfer): Promise<Category> => (await client.post('/categories', transfer)).data