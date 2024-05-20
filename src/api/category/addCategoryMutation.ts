import { gql } from '@apollo/client'
import CategoryTransfer from '../../schema/category/CategoryTransfer'

export default function addCategoryMutation(category: CategoryTransfer): any {
  return {
    mutation: gql`
        mutation AddCategory(
            $category: CategorySchema!
        ) {
            addCategory(
                category: $category
            ) {
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