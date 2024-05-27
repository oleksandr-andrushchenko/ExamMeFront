import { gql } from '@apollo/client'
import CredentialsTransfer from '../../schema/auth/CredentialsTransfer'

export default function authenticateMutation(credentials: CredentialsTransfer): any {
  return {
    mutation: gql`
        mutation Authenticate($credentials: CredentialsSchema!) {
            authenticate(credentials: $credentials) {token}
        }
    `,
    variables: {
      credentials,
    },
  }
}