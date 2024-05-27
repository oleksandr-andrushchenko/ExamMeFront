import { gql } from '@apollo/client'
import QuestionUpdateTransfer from '../../schema/question/QuestionUpdateTransfer'

export default function updateQuestionMutation(questionId: string, questionUpdate: QuestionUpdateTransfer): any {
  return {
    mutation: gql`
        mutation UpdateQuestion($questionId: ID!, $questionUpdate: QuestionUpdateSchema!) {
            updateQuestion(questionId: $questionId, questionUpdate: $questionUpdate) {
                id
                categoryId
                title
                category {
                    name
                }
                type
                answers {
                    variants
                    correct
                    explanation
                }
                choices {
                    title
                    correct
                    explanation
                }
                difficulty
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