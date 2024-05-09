import client from '../client'
import Auth from '../../schema/auth/Auth'
import CredentialsTransfer from '../../schema/auth/CredentialsTransfer'

export default async (transfer: CredentialsTransfer): Promise<Auth> => (await client.post('/auth', transfer)).data