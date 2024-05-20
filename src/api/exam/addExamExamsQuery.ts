import { gql } from '@apollo/client'

export default function addExamExamsQuery(categoryId: string): any {
  return {
    query: gql`
        query AddExamExams(
            $categoryId: ID,
            $size: Int,
            $completion: Boolean
        ) {
            exams(
                categoryId: $categoryId,
                size: $size,
                completion: $completion
            ) {
                id
                categoryId
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