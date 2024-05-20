import { gql } from '@apollo/client'
import QuestionUpdateTransfer from '../../schema/question/QuestionUpdateTransfer'

export default function updateQuestionMutation(questionId: string, questionUpdate: QuestionUpdateTransfer): any {
  return {
    mutation: gql`
        mutation UpdateQuestion(
            $questionUpdate: QuestionUpdateSchema!,
            $questionId: ID!
        ) {
            updateQuestion(
                questionUpdate: $questionUpdate,
                questionId: $questionId
            ) {
                id
                title
                ownerId
            }
        }
    `,
    variables: {
      questionId,
      questionUpdate,
    },
  }
}