import client from '../client'
import Token from '../../schema/auth/Token.ts'
import CredentialsTransfer from '../../schema/auth/CredentialsTransfer'

export default async (transfer: CredentialsTransfer): Promise<Token> => (await client.post('/auth', transfer)).data