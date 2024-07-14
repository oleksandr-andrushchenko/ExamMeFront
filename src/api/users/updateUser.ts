import { gql } from '@apollo/client'
import UpdateUser from '../../schema/users/UpdateUser'

export default function updateUser(userId: string, updateUser: UpdateUser): any {
  return {
    mutation: gql`
        mutation UpdateUser($userId: ID!, $updateUser: UpdateUser!) {
            updateUser(userId: $userId, updateUser: $updateUser) {
                id
                createdAt
                name
                email
                permissions
            }
        }
    `,
    variables: {
      userId,
      updateUser,
    },
  }
}