import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './vendorDashboard/pages/LandingPage'
import './App.css'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default App
