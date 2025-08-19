import React from "react"
import { BrowserRouter, Route, Routes, Router } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import ProtectedRoute from "./utils/ProtectedRoute"


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
