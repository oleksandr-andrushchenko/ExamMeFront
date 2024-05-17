import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

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

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})