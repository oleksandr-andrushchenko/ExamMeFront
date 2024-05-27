import { gql } from '@apollo/client'
import CategoryTransfer from '../../schema/category/CategoryTransfer'

export default function createCategoryMutation(category: CategoryTransfer): any {
  return {
    mutation: gql`
        mutation CreateCategory($category: CategorySchema!) {
            createCategory(category: $category) {
                id
                name
                ownerId
            }
        }
    `,
    variables: {
      category,
    },
  }
}