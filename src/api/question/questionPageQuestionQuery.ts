import { gql } from '@apollo/client'

export default function questionPageQuestionQuery(questionId: string): any {
  return {
    query: gql`
        query QuestionPageQuestion($questionId: ID!) {
            question(questionId: $questionId) {
                id
                title
                category {id name}
                type
                answers {variants correct explanation}
                choices {title correct explanation}
                difficulty
            }
        }
    `,
    variables: {
      questionId,
    },
  }
}