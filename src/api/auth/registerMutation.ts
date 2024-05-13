import MeTransfer from '../../schema/me/MeTransfer'
import { gql } from '@apollo/client'

export default function registerMutation(me: MeTransfer): any {
  return {
    mutation: gql`
        mutation Register($me: MeSchema!, $credentials: CredentialsSchema!) {
            addMe(me: $me) {id}
            addAuth(credentials: $credentials) {token}
        }
    `,
    variables: {
      me,
      credentials: me,
    },
  }
}