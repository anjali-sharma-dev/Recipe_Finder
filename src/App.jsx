import React from 'react'
import Home from './components/pages/Home'
import Dashboard from './components/pages/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Result from './components/pages/Result'
import MealDetail from './components/pages/MealDetail'

const App = () => {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/results' element={<Result/>}/>
        <Route path='/meal/:id' element={<MealDetail/>}/>
      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App