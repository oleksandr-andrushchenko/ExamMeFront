import './App.css';
import NavBar from "./components/NavBar.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Categories from "./pages/Categories.tsx";

export default function App() {
  return (
    <>
      <div className="min-h-full">
        <Router>
          <NavBar width={4}/>
          <Routes>
            <Route index element={<Home/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/categories" element={<Categories/>}/>
          </Routes>
        </Router>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">{/* Your content */}</div>
        </main>
      </div>
    </>
  )
}

