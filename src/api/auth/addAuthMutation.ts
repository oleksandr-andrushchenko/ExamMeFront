import { gql } from '@apollo/client'
import CredentialsTransfer from '../../schema/auth/CredentialsTransfer'

export default function addAuthMutation(credentials: CredentialsTransfer): any {
  return {
    mutation: gql`
        mutation AddAuth($credentials: CredentialsSchema!) {
            addAuth(credentials: $credentials) {token}
        }
    `,
    variables: {
      credentials,
    },
  }
}