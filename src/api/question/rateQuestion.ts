import { gql } from '@apollo/client'

export default function rateQuestion(questionId: string, mark: number): any {
  return {
    mutation: gql`
        mutation RateQuestion($questionId: ID!, $mark: Int!) {
            rateQuestion(questionId: $questionId, mark: $mark) {
                id
            }
        }
    `,
    variables: {
      questionId,
      mark,
    },
  }
}