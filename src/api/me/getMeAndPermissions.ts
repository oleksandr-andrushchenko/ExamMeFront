import { gql } from '@apollo/client'

export default function getMeAndPermissions(): any {
  return {
    query: gql`
        query GetMeAndPermissions {
            me {id email permissions}
            permission {hierarchy {regular root}}
        }
    `,
    variables: {},
  }
}