import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { 
  Route,
  createBrowserRouter, 
  createRoutesFromElements,
  RouterProvider } from 'react-router-dom'
import {HelmetProvider} from "react-helmet-async"
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import SignupPage from './pages/SignupPage.tsx'
import Tracker from './pages/Tracker.tsx'
import WalletPage from './pages/WalletPage.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={true} element={<HomePage/>}></Route>
      <Route path='Login' element={<LoginPage/>}></Route>
      <Route path='Signup' element={<SignupPage/>}></Route>
      <Route path='Dashboard' element={<Tracker/>}></Route>
      <Route path='Wallet' element={<WalletPage/>}></Route>
      
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router}/>
    </HelmetProvider>
  </React.StrictMode>,
)
