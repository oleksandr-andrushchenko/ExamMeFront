import { gql } from '@apollo/client'

export default function rateCategory(categoryId: string, mark: number): any {
  return {
    mutation: gql`
        mutation RateCategory($categoryId: ID!, $mark: Int!) {
            rateCategory(categoryId: $categoryId, mark: $mark) {
                id
            }
        }
    `,
    variables: {
      categoryId,
      mark,
    },
  }
}