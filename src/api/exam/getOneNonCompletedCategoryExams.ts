import { gql } from '@apollo/client'

export default function getOneNonCompletedCategoryExams(categoryId: string): any {
  return {
    query: gql`
        query GetOneNonCompletedCategoryExams($categoryId: ID, $size: Int, $completion: Boolean) {
            exams(categoryId: $categoryId, size: $size, completion: $completion) {
                id
                categoryId
                ownerId
            }
        }
    `,
    variables: {
      categoryId,
      completion: false,
      size: 1,
    },
  }
}