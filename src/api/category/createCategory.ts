import { gql } from '@apollo/client'
import CreateCategory from '../../schema/category/CreateCategory'

export default function createCategory(createCategory: CreateCategory): any {
  return {
    mutation: gql`
        mutation CreateCategory($createCategory: CreateCategory!) {
            createCategory(createCategory: $createCategory) {
                id
                name
                isApproved
                isOwner
                isCreator
            }
        }
    `,
    variables: {
      createCategory,
    },
  }
}