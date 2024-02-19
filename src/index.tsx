import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ThemeProvider from "./components/ThemeProvider";
import Category from "./pages/Category";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import AuthProvider from "./context/AuthProvider";
import Unauthorized from "./pages/Unauthorized";
import AddCategory from "./pages/AddCategory";
import RequireAuth from "./components/RequireAuth";
import Permission from "./enum/Permission";
import { default as Path } from "./enum/Route";
import AddQuestion from "./pages/AddQuestion";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout/>}>
      <Route path={Path.HOME} element={<Home/>}/>
      <Route path={Path.CATEGORIES} element={<Categories/>}/>
      <Route element={<RequireAuth permission={Permission.CREATE_CATEGORY}/>}>
        <Route path={Path.ADD_CATEGORY} element={<AddCategory/>}/>
      </Route>
      <Route path={Path.CATEGORY} element={<Category/>}/>
      <Route element={<RequireAuth permission={Permission.CREATE_QUESTION}/>}>
        <Route path={Path.ADD_QUESTION} element={<AddQuestion/>}/>
      </Route>
      <Route path={Path.LOGIN} element={<Login/>}/>
      <Route path={Path.REGISTER} element={<Register/>}/>
      <Route path={Path.TERMS_AND_CONDITIONS} element={<TermsAndConditions/>}/>
      <Route path={Path.UNAUTHORIZED} element={<Unauthorized/>}/>
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
