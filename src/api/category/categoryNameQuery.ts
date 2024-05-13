import { gql } from '@apollo/client'

export default function categoryNameQuery(categoryId: string): any {
  return {
    query: gql`
        query CategoryName($categoryId: ID!) {
            category(categoryId: $categoryId) {name}
        }
    `,
    variables: {
      categoryId,
    },
  }
}