import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import type { ApolloQueryResult, DefaultContext, OperationVariables } from '@apollo/client/core/types'
import type { MutationOptions, QueryOptions } from '@apollo/client/core/watchQueryOptions'
import type { ApolloCache } from '@apollo/client/cache'
import type { FetchResult } from '@apollo/client/link/core'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_BASE_URL,
})

const authLink = setContext((_, { headers }) => {
  const authenticationTokenString = localStorage.getItem('authenticationToken')
  const authenticationToken = authenticationTokenString ? JSON.parse(authenticationTokenString) : undefined

  if (authenticationToken) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${ authenticationToken.token }`,
      },
    }
  }

  return {
    headers,
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
  }),
})

export default apolloClient

export function apiQuery<T = any, TVariables extends OperationVariables = OperationVariables>(
  options: QueryOptions<TVariables, T>,
  setData: (data: T) => void,
  setError: (message: string) => void = () => {
  },
  setLoading: (loading: boolean) => void = () => {
  },
): Promise<ApolloQueryResult<T>> {
  setLoading(true)
  options = {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    ...options,
  }
  return apolloClient.query<T>(options)
    .then(({ data, errors }) => {
      if (errors) {
        const error = errors
          .filter(error => !error.message.startsWith('Access denied!'))
          .map(error => error.message).join('\n')

        if (error) {
          setError && setError(error)
          return
        }
      }

      setData(data)
    })
    .catch(err => setError && setError(err.message))
    .finally(() => setLoading && setLoading(false))
}

export function apiMutate<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TContext extends Record<string, any> = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
>(
  options: MutationOptions<TData, TVariables, TContext>,
  setData: (data: TData) => void,
  setError: (message: string) => void = () => {
  },
  setLoading: (loading: boolean) => void = () => {
  },
): Promise<FetchResult<TData>> {
  setLoading(true)
  options = {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    ...options,
  }
  return apolloClient.mutate<TData, TVariables, TContext, TCache>(options)
    .then(({ data, errors }) => {
      if (errors) {
        const error = errors
          .filter(error => !error.message.startsWith('Access denied!'))
          .map(error => error.message).join('\n')

        if (error) {
          setError && setError(error)
          return
        }
      }

      setData(data)
    })
    .catch(err => setError && setError(err.message))
    .finally(() => setLoading && setLoading(false))
}