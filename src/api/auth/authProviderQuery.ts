import { gql } from '@apollo/client'

export default function authProviderQuery(): any {
  return {
    query: gql`
        query AuthProvider {
            me {id email permissions}
            permission {hierarchy {regular root}}
        }
    `,
    variables: {},
  }
}