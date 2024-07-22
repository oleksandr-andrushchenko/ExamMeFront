import { gql } from '@apollo/client'

export default function toggleQuestionApprove(questionId: string): any {
  return {
    mutation: gql`
        mutation ToggleQuestionApprove($questionId: ID!) {
            toggleQuestionApprove(
                questionId: $questionId
            )
        }
    `,
    variables: {
      questionId,
    },
  }
}