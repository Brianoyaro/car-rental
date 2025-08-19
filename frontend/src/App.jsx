import React from "react"
import { BrowserRouter, Route, Routes, Router } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"


function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
