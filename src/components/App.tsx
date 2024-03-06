import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Home from '../pages/Home'
import Categories from '../pages/Categories'
import ThemeProvider from './ThemeProvider'
import Category from '../pages/Category'
import Login from '../pages/Login'
import Register from '../pages/Register'
import NotFound from '../pages/NotFound'
import TermsAndConditions from '../pages/TermsAndConditions'
import AuthProvider from '../context/AuthProvider'
import AddCategory from '../pages/AddCategory'
import RequireLoggedIn from './RequireLoggedIn'
import Permission from '../enum/Permission'
import { default as Path } from '../enum/Route'
import AddQuestion from '../pages/AddQuestion'
import RequireLoggedOut from './RequireLoggedOut'

const routes = <Routes>
  <Route element={ <Layout/> }>
    <Route path={ Path.HOME } element={ <Home/> }/>
    <Route path={ Path.CATEGORIES } element={ <Categories/> }/>
    <Route element={ <RequireLoggedIn permission={ Permission.CREATE_CATEGORY }/> }>
      <Route path={ Path.ADD_CATEGORY } element={ <AddCategory/> }/>
    </Route>
    <Route path={ Path.CATEGORY } element={ <Category/> }/>
    <Route element={ <RequireLoggedIn permission={ Permission.CREATE_QUESTION }/> }>
      <Route path={ Path.ADD_QUESTION } element={ <AddQuestion/> }/>
    </Route>
    <Route element={ <RequireLoggedOut/> }>
      <Route path={ Path.LOGIN } element={ <Login/> }/>
    </Route>
    <Route element={ <RequireLoggedOut/> }>
      <Route path={ Path.REGISTER } element={ <Register/> }/>
    </Route>
    <Route path={ Path.TERMS_AND_CONDITIONS } element={ <TermsAndConditions/> }/>
    <Route path="*" element={ <NotFound/> }/>
  </Route>
</Routes>

export default () => <AuthProvider>
  <ThemeProvider>
    <BrowserRouter>
      { routes }
    </BrowserRouter>
  </ThemeProvider>
</AuthProvider>
