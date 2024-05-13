import { gql } from '@apollo/client'
import QuestionTransfer from '../../schema/question/QuestionTransfer'

export default function addQuestionMutation(question: QuestionTransfer): any {
  return {
    mutation: gql`
        mutation AddQuestion($question: QuestionSchema!) {
            addQuestion(question: $question) {id title ownerId}
        }
    `,
    variables: {
      question,
    },
  }
}