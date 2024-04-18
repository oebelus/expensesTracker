import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './tailwind.css'
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
import BudgetingPage from './pages/BudgetingPage.tsx'
import SavingPage from './pages/SavingPage.tsx'
import Profile from './pages/Profile.tsx'
import ProtectedRoute from './Components/ProtectedRoute.tsx'
import ErrorPage from './pages/ErrorPage.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={true} element={<HomePage/>}></Route>
      <Route path='Login' element={<LoginPage/>}></Route>
      <Route path='Signup' element={<SignupPage/>}></Route>
      <Route path='' element={<ProtectedRoute/>}>
        <Route path={`dashboard`} element={<Tracker/>}></Route>
        <Route path={`wallet`} element={<WalletPage/>}></Route>
        <Route path={`budgeting`} element={<BudgetingPage/>}></Route>
        <Route path={`saving`} element={<SavingPage/>}></Route>
        <Route path={`profile`} element={<Profile/>}></Route>
        <Route path="*" element={<ErrorPage/>} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
)


