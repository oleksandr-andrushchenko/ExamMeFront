import { gql } from '@apollo/client'

export default function createExamCompletion(examId: string): any {
  return {
    mutation: gql`
        mutation CreateExamCompletion($examId: ID!) {
            createExamCompletion(examId: $examId) {
                id
                questionNumber
                questionCount
                answeredQuestionCount
                correctAnswerCount
                categoryId
                category {
                    name
                    requiredScore
                }
                completedAt
                ownerId
            }
        }
    `,
    variables: {
      examId,
    },
  }
}