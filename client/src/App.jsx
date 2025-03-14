import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/loginPage/LoginPage'
import RegisterPage from './pages/registerPage/RegisterPage'
import ProtectedPage from './pages/ProtectedPage/ProtectedPage'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<ProtectedPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </>
  )
}

export default App
