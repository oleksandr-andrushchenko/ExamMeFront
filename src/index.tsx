import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import ThemeProvider from "./components/ThemeProvider";
import Category from "./pages/Category";
import categoriesLoader from "./loaders/categoriesLoader";
import categoryLoader from "./loaders/categoryLoader";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout/>}>
      <Route path="/" element={<Home/>}/>
      <Route path="/categories" element={<Categories/>} loader={categoriesLoader}/>
      <Route path="/categories/:categoryId" element={<Category/>} loader={categoryLoader}/>
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
