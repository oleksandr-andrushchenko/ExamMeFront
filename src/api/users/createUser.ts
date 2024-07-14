import { gql } from '@apollo/client'
import CreateUser from '../../schema/users/CreateUser'

export default function createUser(createUser: CreateUser): any {
  return {
    mutation: gql`
        mutation CreateUser($createUser: CreateUser!) {
            createUser(createUser: $createUser) {
                id
                createdAt
                name
                email
                permissions
            }
        }
    `,
    variables: {
      createUser,
    },
  }
}