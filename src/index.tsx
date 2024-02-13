import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, redirect } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ThemeProvider from "./components/ThemeProvider";
import Category from "./pages/Category";
import categoriesLoader from "./loaders/categoriesLoader";
import categoryLoader from "./loaders/categoryLoader";
import Login, { loginAction } from "./pages/Login";
import Register, { registerAction } from "./pages/Register";
import NotFound from "./pages/NotFound";

const register = async (request) => {
  await registerAction(request);

  return redirect('/login');
};

const login = async (request) => {
  await loginAction(request);

  return redirect('/categories');
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/categories" element={<Categories/>} loader={categoriesLoader}/>
      <Route path="/categories/:categoryId" element={<Category/>} loader={categoryLoader}/>
      <Route path="/login" element={<Login/>} action={login}/>
      <Route path="/register" element={<Register/>} action={register}/>
      <Route path="*" element={<NotFound/>}/>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router}/>
    </ThemeProvider>
  </React.StrictMode>,
)
