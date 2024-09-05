import { gql } from '@apollo/client'
import { categoryQuery } from './getCategoriesForCategoriesPage'

export default function getCategoryForCategoriesPage(categoryId: string): any {
  return {
    query: gql`
        query GetCategoryForCategoriesPage($categoryId: ID!) {
            category(categoryId: $categoryId) ${categoryQuery}
        }
    `,
    variables: { categoryId },
  }
}