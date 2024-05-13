import { gql } from '@apollo/client'

export default function removeQuestionMutation(questionId: string): any {
  return {
    mutation: gql`
        mutation RemoveQuestion($questionId: ID!) {
            removeQuestion(questionId: $questionId)
        }
    `,
    variables: {
      questionId,
    },
  }
}