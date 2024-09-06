import { gql } from '@apollo/client'

export default function getQuestionRating(questionId: string): any {
  return {
    query: gql`
        query GetQuestionRating($questionId: ID!) {
            question(questionId: $questionId) {
                rating {
                    markCount
                    averageMark
                    mark
                }
            }
        }
    `,
    variables: { questionId },
  }
}