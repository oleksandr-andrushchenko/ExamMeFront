import { gql } from '@apollo/client'

export default function deleteExam(examId: string): any {
  return {
    mutation: gql`
        mutation DeleteExam($examId: ID!) {
            deleteExam(examId: $examId)
        }
    `,
    variables: {
      examId,
    },
  }
}