import CreateMe from '../../schema/me/CreateMe'
import { gql } from '@apollo/client'

export default function createMeAndAuthenticationToken(createMe: CreateMe): any {
  return {
    mutation: gql`
        mutation Register($createMe: CreateMe!, $credentials: Credentials!) {
            createMe(createMe: $createMe) {id}
            createAuthenticationToken(credentials: $credentials) {token}
        }
    `,
    variables: {
      createMe,
      credentials: createMe,
    },
  }
}