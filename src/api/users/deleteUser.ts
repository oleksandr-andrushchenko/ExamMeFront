import { gql } from '@apollo/client'

export default function deleteUser(userId: string): any {
  return {
    mutation: gql`
        mutation DeleteUser($userId: ID!) {
            deleteUser(userId: $userId)
        }
    `,
    variables: {
      userId,
    },
  }
}