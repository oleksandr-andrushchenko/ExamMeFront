import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Home from '../pages/Home'
import Categories from '../pages/Categories'
import ThemeProvider from './ThemeProvider'
import Category from '../pages/Category'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'
import TermsAndConditions from '../pages/TermsAndConditions'
import AuthProvider from '../context/AuthProvider'
import { default as Path } from '../enum/Route'
import RequireLoggedOut from './RequireLoggedOut'
import { ReactNode } from 'react'
import Question from '../pages/Question'

const routes = <Routes>
  <Route element={ <Layout/> }>
    <Route path={ Path.HOME } element={ <Home/> }/>
    <Route path={ Path.CATEGORIES } element={ <Categories/> }/>
    <Route path={ Path.CATEGORY } element={ <Category/> }/>
    <Route path={ Path.QUESTION } element={ <Question/> }/>
    <Route element={ <RequireLoggedOut/> }>
      <Route path={ Path.REGISTER } element={ <Register/> }/>
    </Route>
    <Route path={ Path.TERMS_AND_CONDITIONS } element={ <TermsAndConditions/> }/>
    <Route path="*" element={ <NotFound/> }/>
  </Route>
</Routes>

export default (): ReactNode => <AuthProvider>
  <ThemeProvider>
    <BrowserRouter>
      { routes }
    </BrowserRouter>
  </ThemeProvider>
</AuthProvider>
