import { gql } from '@apollo/client'
import UpdateCategory from '../../schema/category/UpdateCategory'

export default function updateCategory(categoryId: string, updateCategory: UpdateCategory): any {
  return {
    mutation: gql`
        mutation UpdateCategory($categoryId: ID!, $updateCategory: UpdateCategory!) {
            updateCategory(categoryId: $categoryId, updateCategory: $updateCategory) {
                id
                name
                questionCount
                approvedQuestionCount
                requiredScore
                isApproved
                isOwner
                isCreator
                rating {
                    averageMark
                    markCount
                    mark
                }
                examId
            }
        }
    `,
    variables: {
      categoryId,
      updateCategory,
    },
  }
}