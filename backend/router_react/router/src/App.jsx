import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './component/Login'
import Sign from './component/Sign'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/signup' element={<Sign/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App
