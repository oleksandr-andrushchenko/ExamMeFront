import { gql } from '@apollo/client'
import QuestionTransfer from '../../schema/question/QuestionTransfer'

export default function createQuestionMutation(question: QuestionTransfer): any {
  return {
    mutation: gql`
        mutation CreateQuestion($question: QuestionSchema!) {
            createQuestion(question: $question) {
                id
                title
                ownerId
            }
        }
    `,
    variables: {
      question,
    },
  }
}