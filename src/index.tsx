import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, LoaderFunction, Route, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ThemeProvider from "./components/ThemeProvider";
import Category from "./pages/Category";
import getCategories from "./api/getCategories";
import getCategoryAndQuestions from "./loaders/getCategoryAndQuestions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import AuthProvider from "./context/AuthProvider";
import Unauthorized from "./pages/Unauthorized";
import AddCategory from "./pages/AddCategory";
import RequireAuth from "./components/RequireAuth";
import Permission from "./schema/Permission";
import RoutePath from "./schema/RoutePath";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout/>}>
      <Route path={RoutePath.HOME} element={<Home/>}/>
      <Route path={RoutePath.CATEGORIES} element={<Categories/>} loader={getCategories}/>
      <Route path={RoutePath.CATEGORY} element={<Category/>} loader={getCategoryAndQuestions as LoaderFunction}/>
      <Route element={<RequireAuth permission={Permission.CREATE_CATEGORY}/>}>
        <Route path={RoutePath.ADD_CATEGORY} element={<AddCategory/>}/>
      </Route>
      <Route path={RoutePath.LOGIN} element={<Login/>}/>
      <Route path={RoutePath.REGISTER} element={<Register/>}/>
      <Route path={RoutePath.TERMS_AND_CONDITIONS} element={<TermsAndConditions/>}/>
      <Route path={RoutePath.UNAUTHORIZED} element={<Unauthorized/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router}/>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
