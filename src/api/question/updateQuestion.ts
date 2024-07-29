import { gql } from '@apollo/client'
import UpdateQuestion from '../../schema/question/UpdateQuestion'

export default function updateQuestion(questionId: string, updateQuestion: UpdateQuestion): any {
  return {
    mutation: gql`
        mutation UpdateQuestion($questionId: ID!, $updateQuestion: UpdateQuestion!) {
            updateQuestion(questionId: $questionId, updateQuestion: $updateQuestion) {
                id
                categoryId
                title
                category {
                    name
                }
                type
                choices {
                    title
                    correct
                    explanation
                }
                difficulty
                isApproved
                isOwner
                isCreator
            }
        }
    `,
    variables: {
      questionId,
      updateQuestion,
    },
  }
}