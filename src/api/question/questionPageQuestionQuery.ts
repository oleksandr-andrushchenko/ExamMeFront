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
    },
  }
}