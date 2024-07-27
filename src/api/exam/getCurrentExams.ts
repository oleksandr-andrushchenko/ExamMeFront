import { gql } from '@apollo/client'

export default function getCurrentExams(categoryIds: string[]): any {
  return {
    query: gql`
        query GetCurrentExams($categoryIds: [ID!]!) {
            currentExams(categoryIds: $categoryIds) {
                id
                categoryId
                ownerId
            }
        }
    `,
    variables: {
      categoryIds,
    },
  }
}