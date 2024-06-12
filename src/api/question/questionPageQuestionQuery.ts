import { gql } from '@apollo/client'

export default function questionPageQuestionQuery(questionId: string): any {
  return {
    query: gql`
        query QuestionPageQuestion($questionId: ID!) {
            question(questionId: $questionId) {
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
                ownerId
            }
        }
    `,
    variables: {
      questionId,
    },
    fetchPolicy: 'network-only',
  }
}