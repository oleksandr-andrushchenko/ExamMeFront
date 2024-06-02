import { gql } from '@apollo/client'

export default function oneNonCompletedCategoryExamsQuery(categoryId: string): any {
  return {
    query: gql`
        query OneNonCompletedCategoryExams($categoryId: ID, $size: Int, $completion: Boolean) {
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
    fetchPolicy: 'network-only',
  }
}