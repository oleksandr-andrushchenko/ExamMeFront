import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import type { OperationVariables } from '@apollo/client/core/types'
import type { QueryOptions } from '@apollo/client/core/watchQueryOptions'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_BASE_URL,
})

const authLink = setContext((_, { headers }) => {
  const authString = localStorage.getItem('auth')
  const auth = authString ? JSON.parse(authString) : undefined

  if (auth) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${ auth.token }`,
      },
    }
  }

  return {
    headers,
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default apolloClient

export function apiQuery<T = any, TVariables extends OperationVariables = OperationVariables>(
  options: QueryOptions<TVariables, T>,
  setData: (data: T) => void,
  setError: (message: string) => void,
  setLoading: (loading: boolean) => void,
): void {
  setLoading(true)
  apolloClient.query<T>(options)
    .then(({ data, errors }): void => {
      if (errors) {
        const error = errors
          .filter(error => !error.message.startsWith('Access denied!'))
          .map(error => error.message).join('\n')

        if (error) {
          setError(error)
          return
        }
      }

      setData(data)
    })
    .catch((err): void => setError(err.message))
    .finally((): void => setLoading(false))
}