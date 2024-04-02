import client from './client'
import Auth from '../schema/Auth'

export default async ({ email, password }: {
  email: string,
  password: string
}): Promise<Auth> => (await client.post('/auth', { email, password })).data