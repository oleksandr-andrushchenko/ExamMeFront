import { gql } from '@apollo/client'

export default function getCategory(categoryId: string): any {
  return {
    query: gql`
        query GetCategory($categoryId: ID!) {
            category(categoryId: $categoryId) {
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
    variables: { categoryId },
  }
}