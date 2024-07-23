import { gql } from '@apollo/client'

export default function toggleCategoryApprove(categoryId: string): any {
  return {
    mutation: gql`
        mutation ToggleCategoryApprove($categoryId: ID!) {
            toggleCategoryApprove(
                categoryId: $categoryId
            ) {
                id
                name
                questionCount
                requiredScore
                ownerId
            }
        }
    `,
    variables: {
      categoryId,
    },
  }
}