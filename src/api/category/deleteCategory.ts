import { gql } from '@apollo/client'

export default function deleteCategory(categoryId: string): any {
  return {
    mutation: gql`
        mutation DeleteCategory($categoryId: ID!) {
            deleteCategory(categoryId: $categoryId)
        }
    `,
    variables: {
      categoryId,
    },
  }
}