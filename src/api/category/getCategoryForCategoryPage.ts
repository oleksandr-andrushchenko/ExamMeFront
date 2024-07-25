import { gql } from '@apollo/client'

export default function getCategoryForCategoryPage(categoryId: string): any {
  return {
    query: gql`
        query GetCategoryForCategoryPage($categoryId: ID!) {
            category(categoryId: $categoryId) {
                id
                name
                questionCount
                approvedQuestionCount
                requiredScore
                ownerId
            }
        }
    `,
    variables: { categoryId },
  }
}