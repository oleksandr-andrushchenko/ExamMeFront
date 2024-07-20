import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Home from '../pages/Home'
import Categories from '../pages/Categories'
import ThemeProvider from './ThemeProvider'
import Category from '../pages/Category'
import NotFound from '../pages/NotFound'
import Terms from '../pages/Terms'
import { AuthenticationProvider } from '../hooks/useAuth'
import { default as Path } from '../enum/Route'
import Question from '../pages/Question'
import Questions from '../pages/Questions'
import Exam from '../pages/Exam'
import RequireAuthentication from './RequireAuthentication'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../api/apolloClient'
import Users from '../pages/Users'
import UserPermission from '../enum/users/UserPermission'

const routes = <Routes>
  <Route element={ <Layout/> }>
    <Route path={ Path.Home } element={ <Home/> }/>
    <Route path={ Path.Categories } element={ <Categories/> }/>
    <Route path={ Path.Category } element={ <Category/> }/>
    <Route path={ Path.Questions } element={ <Questions/> }/>
    <Route path={ Path.Question } element={ <Question/> }/>
    <Route element={ <RequireAuthentication/> }>
      <Route path={ Path.Exam } element={ <Exam/> }/>
    </Route>
    <Route path={ Path.Terms } element={ <Terms/> }/>
    <Route element={ <RequireAuthentication permission={ UserPermission.Get }/> }>
      <Route path={ Path.Users } element={ <Users/> }/>
    </Route>
    <Route path="*" element={ <NotFound/> }/>
  </Route>
</Routes>

export default function App() {
  return (
    <AuthenticationProvider>
      <ThemeProvider>
        <ApolloProvider client={ apolloClient }>
          <BrowserRouter>
            { routes }
          </BrowserRouter>
        </ApolloProvider>
      </ThemeProvider>
    </AuthenticationProvider>
  )
}
