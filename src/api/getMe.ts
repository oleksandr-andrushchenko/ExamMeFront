import client from './client'
import Me from '../schema/Me'

export default async (): Promise<Me> => (await client.get('/me')).data