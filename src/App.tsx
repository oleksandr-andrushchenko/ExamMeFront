import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Categories from "./pages/Categories.tsx";
import Layout from "./components/Layout.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/categories" element={<Categories/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

