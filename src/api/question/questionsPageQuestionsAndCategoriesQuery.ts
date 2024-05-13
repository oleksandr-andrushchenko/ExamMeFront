import { gql } from '@apollo/client'
import QuestionQuery from '../../schema/question/QuestionQuery'

export default function questionsPageQuestionsAndCategoriesQuery(filter: QuestionQuery = {}): any {
  if ('size' in filter) {
    filter.size = +filter.size
  }

  return {
    query: gql`
        query QuestionsPageQuestionsAndCategories(
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
            categories {id name}
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
                data {difficulty id title type categoryId}
                meta {nextCursor prevCursor}
            }
        }
    `,
    variables: filter,
  }
}