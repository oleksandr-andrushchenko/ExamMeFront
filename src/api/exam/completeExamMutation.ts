import { gql } from '@apollo/client'

export default function completeExamMutation(examId: string): any {
  return {
    mutation: gql`
        mutation CompleteExam($examId: ID!) {
            completeExam(examId: $examId) {
                categoryId
                ownerId
            }
        }
    `,
    variables: {
      examId,
    },
  }
}