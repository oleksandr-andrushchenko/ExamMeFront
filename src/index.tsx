import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ThemeProvider from "./components/ThemeProvider";
import Category from "./pages/Category";
import { getCategories } from "./api/getCategories";
import { getCategoryAndQuestions } from "./api/getCategoryAndQuestions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import AuthProvider from "./context/AuthProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/categories" element={<Categories/>} loader={getCategories}/>
      <Route path="/categories/:categoryId" element={<Category/>} loader={getCategoryAndQuestions}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
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
