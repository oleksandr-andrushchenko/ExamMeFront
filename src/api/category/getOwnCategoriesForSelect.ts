import { gql } from '@apollo/client'

export default function getOwnCategoriesForSelect(): any {
  return {
    query: gql`
        query GetOwnCategoriesForSelect {
            ownCategories {
                id
                name
            }
        }
    `,
    variables: {},
  }
}