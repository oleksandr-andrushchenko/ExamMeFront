import { gql } from '@apollo/client'
import Credentials from '../../schema/auth/Credentials'

export default function createAuthenticationToken(credentials: Credentials): any {
  return {
    mutation: gql`
        mutation CreateAuthenticationToken($credentials: Credentials!) {
            createAuthenticationToken(credentials: $credentials) {token}
        }
    `,
    variables: {
      credentials,
    },
  }
}