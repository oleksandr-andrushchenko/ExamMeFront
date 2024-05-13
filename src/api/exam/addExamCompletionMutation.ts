import { gql } from '@apollo/client'

export default function addExamCompletionMutation(examId: string): any {
  return {
    mutation: gql`
        mutation AddExamCompletion($examId: ID!) {
            addExamCompletion(examId: $examId)
        }
    `,
    variables: {
      examId,
    },
  }
}