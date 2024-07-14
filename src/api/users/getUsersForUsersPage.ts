import { gql } from '@apollo/client'
import GetUsers from '../../schema/users/GetUsers'

export default function getUsersForUsersPage(filter: GetUsers = {}): any {
  if ('size' in filter) {
    filter.size = +filter.size
  }

  return {
    query: gql`
        query GetUsersForUsersPage($prevCursor: String, $nextCursor: String, $cursor: String, $size: Int, $order: String, $search: String) {
            paginatedUsers(prevCursor: $prevCursor, nextCursor: $nextCursor, cursor: $cursor, size: $size, order: $order, search: $search) {
                data {
                    id
                    createdAt
                    updatedAt
                    name
                    email
                    permissions
                }
                meta {
                    prevCursor
                    prevUrl
                    nextCursor
                    nextUrl
                    cursor
                    size
                    order
                }
            }
        }
    `,
    variables: filter,
  }
}