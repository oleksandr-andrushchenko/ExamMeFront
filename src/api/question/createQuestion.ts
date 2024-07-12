import { gql } from '@apollo/client'
import CreateQuestion from '../../schema/question/CreateQuestion'

export default function createQuestion(createQuestion: CreateQuestion): any {
  return {
    mutation: gql`
        mutation CreateQuestion($createQuestion: CreateQuestion!) {
            createQuestion(createQuestion: $createQuestion) {
                id
                title
                ownerId
            }
        }
    `,
    variables: {
      createQuestion,
    },
  }
}