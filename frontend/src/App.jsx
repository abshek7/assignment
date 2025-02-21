import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import Navbar from "./components/NavBar"
import BookList from "./components/BookList"
import AddBook from "./components/AddBook" 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-6 px-4">
        <Routes>
        <Route path="/" element={<AddBook />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/add" element={<AddBook />} />
      </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App

