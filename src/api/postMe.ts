import client from './client'
import Me from '../schema/Me'

export default async ({ email, password }: {
  email: string,
  password: string
}): Promise<Me> => (await client.post('/me', { email, password })).data