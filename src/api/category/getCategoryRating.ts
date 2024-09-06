import { gql } from '@apollo/client'

export default function getCategoryRating(categoryId: string): any {
  return {
    query: gql`
        query GetCategoryRating($categoryId: ID!) {
            category(categoryId: $categoryId) {
                rating {
                    markCount
                    averageMark
                    mark
                }
            }
        }
    `,
    variables: { categoryId },
  }
}