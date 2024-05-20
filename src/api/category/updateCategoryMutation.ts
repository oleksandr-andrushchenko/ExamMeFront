import { gql } from '@apollo/client'
import CategoryUpdateTransfer from '../../schema/category/CategoryUpdateTransfer'

export default function updateCategoryMutation(categoryId: string, categoryUpdate: CategoryUpdateTransfer): any {
  return {
    mutation: gql`
        mutation UpdateCategory(
            $categoryUpdate: CategoryUpdateSchema!,
            $categoryId: ID!
        ) {
            updateCategory(
                categoryUpdate: $categoryUpdate,
                categoryId: $categoryId
            ) {
                id
                name
                ownerId
            }
        }
    `,
    variables: {
      categoryId,
      categoryUpdate,
    },
  }
}