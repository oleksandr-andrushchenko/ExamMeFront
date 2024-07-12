import { gql } from '@apollo/client'
import GetQuestions from '../../schema/question/GetQuestions'

export default function getQuestionsAndCategoriesForQuestionsPage(filter: GetQuestions = {}): any {
  if ('size' in filter) {
    filter.size = +filter.size
  }

  return {
    query: gql`
        query GetQuestionsAndCategoriesForQuestionsPage(
            $prevCursor: String,
            $nextCursor: String,
            $cursor: String,
            $size: Int,
            $order: String,
            $price: String,
            $categoryId: ID,
            $search: String,
            $difficulty: String,
            $type: String
        ) {
            categories {
                id
                name
            }
            paginatedQuestions(
                prevCursor: $prevCursor,
                nextCursor: $nextCursor,
                cursor: $cursor,
                size: $size,
                order: $order,
                price: $price,
                categoryId: $categoryId,
                search: $search,
                difficulty: $difficulty,
                type: $type
            ) {
                data {
                    id
                    categoryId
                    title
                    type
                    choices {
                        title
                        correct
                        explanation
                    }
                    difficulty
                    ownerId
                }
                meta {
                    nextCursor
                    prevCursor
                }
            }
        }
    `,
    variables: filter,
  }
}