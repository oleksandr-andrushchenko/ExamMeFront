import { gql } from '@apollo/client'

export default function getCategoriesForSelect(): any {
  return {
    query: gql`
        query GetCategoriesForSelect {
            categories {
                id
                name
            }
        }
    `,
    variables: {},
  }
}