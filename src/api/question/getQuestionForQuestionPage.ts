import { gql } from '@apollo/client'

export default function getQuestionForQuestionPage(questionId: string): any {
  return {
    query: gql`
        query GetQuestionForQuestionPage($questionId: ID!) {
            question(questionId: $questionId) {
                id
                categoryId
                title
                category {
                    name
                }
                type
                choices {
                    title
                    correct
                    explanation
                }
                difficulty
                isApproved
                isOwner
                isCreator
                rating {
                    averageMark
                    markCount
                    mark
                }
            }
        }
    `,
    variables: {
      questionId,
    },
  }
}