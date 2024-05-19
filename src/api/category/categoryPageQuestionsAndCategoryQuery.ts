import { gql } from '@apollo/client'
import QuestionQuery from '../../schema/question/QuestionQuery'

export default function categoryPageQuestionsAndCategoryQuery(categoryId: string, filter: QuestionQuery = {}): any {
  filter.categoryId = categoryId

  if ('size' in filter) {
    filter.size = +filter.size
  }

  return {
    query: gql`
        query CategoryPageQuestionsAndCategory(
            $categoryId: ID!,
            $prevCursor: String,
            $nextCursor: String,
            $cursor: String,
            $size: Int,
            $order: String,
            $price: String,
            $search: String,
            $difficulty: String,
            $type: String
        ) {
            paginatedQuestions(
                categoryId: $categoryId,
                prevCursor: $prevCursor,
                nextCursor: $nextCursor,
                cursor: $cursor,
                size: $size,
                order: $order,
                price: $price,
                search: $search,
                difficulty: $difficulty,
                type: $type
            ) {
                data {
                    difficulty
                    id
                    title
                    type
                    categoryId
                    answers {variants correct explanation}
                    choices {title correct explanation}
                }
                meta {nextCursor prevCursor}
            }
            category(categoryId: $categoryId) {id name questionCount ownerId}
        }
    `,
    variables: filter,
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  }
}