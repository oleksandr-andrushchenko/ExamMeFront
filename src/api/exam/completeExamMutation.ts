import { gql } from '@apollo/client'

export default function completeExamMutation(examId: string): any {
  return {
    mutation: gql`
        mutation CompleteExam($examId: ID!) {
            completeExam(examId: $examId) {
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