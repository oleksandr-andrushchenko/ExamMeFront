import { gql } from '@apollo/client'

export default function deleteQuestion(questionId: string): any {
  return {
    mutation: gql`
        mutation DeleteQuestion($questionId: ID!) {
            deleteQuestion(
                questionId: $questionId
            )
        }
    `,
    variables: {
      questionId,
    },
  }
}