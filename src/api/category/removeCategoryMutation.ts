import { gql } from '@apollo/client'

export default function removeCategoryMutation(categoryId: string): any {
  return {
    mutation: gql`
        mutation RemoveCategory($categoryId: ID!) {
            removeCategory(categoryId: $categoryId)
        }
    `,
    variables: {
      categoryId,
    },
  }
}