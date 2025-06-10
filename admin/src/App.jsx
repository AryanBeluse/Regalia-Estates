import React, { useContext } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { AdminContext } from './context/AdminContext.jsx';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Sidebar from './components/Sidebar';
import ListingsList from './pages/admin/ListingsList.jsx';
import UsersList from './pages/admin/UsersList.jsx';
import AdminListing from './pages/admin/AdminListing.jsx';
import UserProfile from './pages/admin/UserProfile.jsx';






const App = () => {
  const { aToken } = useContext(AdminContext);


  return aToken ? (
    <div className='bg-blue-50'>
      <ToastContainer autoClose={500} />
      <Navbar />
      <div className='flex h-screen'>

        <Sidebar className="fixed top-0 left-0 h-full w-64 bg-white shadow-md z-10" />


        <div className='flex-1 overflow-y-auto'>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/listings" element={<ListingsList />} />
            <Route path="/listing/:id" element={<AdminListing />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <SignIn />
  );

}

export default App
