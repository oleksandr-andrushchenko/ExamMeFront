import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Home from '../pages/Home'
import Categories from '../pages/Categories'
import ThemeProvider from './ThemeProvider'
import Category from '../pages/Category'
import NotFound from '../pages/NotFound'
import Terms from '../pages/Terms'
import { AuthProvider } from '../hooks/useAuth'
import { default as Path } from '../enum/Route'
import Question from '../pages/Question'
import Questions from '../pages/Questions'
import Exam from '../pages/Exam'
import RequireAuthentication from './RequireAuthentication'
import ExamPermission from '../enum/exam/ExamPermission'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../api/apolloClient'

const routes = <Routes>
  <Route element={ <Layout/> }>
    <Route path={ Path.HOME } element={ <Home/> }/>
    <Route path={ Path.CATEGORIES } element={ <Categories/> }/>
    <Route path={ Path.CATEGORY } element={ <Category/> }/>
    <Route path={ Path.QUESTIONS } element={ <Questions/> }/>
    <Route path={ Path.QUESTION } element={ <Question/> }/>
    <Route element={ <RequireAuthentication permission={ ExamPermission.GET }/> }>
      <Route path={ Path.EXAM } element={ <Exam/> }/>
    </Route>
    <Route path={ Path.TERMS } element={ <Terms/> }/>
    <Route path="*" element={ <NotFound/> }/>
  </Route>
</Routes>

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ApolloProvider client={ apolloClient }>
          <BrowserRouter>
            { routes }
          </BrowserRouter>
        </ApolloProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
