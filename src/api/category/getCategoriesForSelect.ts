import { gql } from '@apollo/client'

export default function getCategoriesForSelect(): any {
  return {
    query: gql`
        query GetCategoriesForSelect($size: Int) {
            categories(size: $size) {
                id
                name
            }
        }
    `,
    variables: {
      size: 50,
    },
  }
}