import client from '../client'
import Me from '../../schema/me/Me'
import CredentialsTransfer from '../../schema/auth/CredentialsTransfer'

export default async (transfer: CredentialsTransfer): Promise<Me> => (await client.post('/me', transfer)).data