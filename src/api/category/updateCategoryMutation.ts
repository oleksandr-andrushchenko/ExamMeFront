import { gql } from '@apollo/client'
import CategoryUpdateTransfer from '../../schema/category/CategoryUpdateTransfer'

export default function updateCategoryMutation(categoryId: string, categoryUpdate: CategoryUpdateTransfer): any {
  return {
    mutation: gql`
        mutation UpdateCategory($categoryId: ID!, $categoryUpdate: CategoryUpdateSchema!) {
            updateCategory(categoryId: $categoryId, categoryUpdate: $categoryUpdate) {
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