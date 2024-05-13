import { gql } from '@apollo/client'

export default function removeExamMutation(examId: string): any {
  return {
    mutation: gql`
        mutation RemoveExam($examId: ID!) {
            removeExam(examId: $examId)
        }
    `,
    variables: {
      examId,
    },
  }
}