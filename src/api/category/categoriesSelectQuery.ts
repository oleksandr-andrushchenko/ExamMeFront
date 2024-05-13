import { gql } from '@apollo/client'

export default function categoriesSelectQuery(): any {
  return {
    query: gql`
        query CategoriesSelect {
            categories {id name}
        }
    `,
    variables: {},
  }
}