import React from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import SignUp from './pages/SignUp'
import CreateListing from './pages/CreateListing'
import EditListing from './pages/EditListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import { useSelector } from 'react-redux'
import YourListings from './pages/YourListings'
import SavedListings from './pages/SavedListings'
import ChatList from './pages/ChatList'
import ChatRoom from './pages/ChatRoom'
import BrokerLogin from './pages/BrokerLogin'
import Preferences from './pages/Preferences'
import Dashboard from './pages/Dashboard'

const App = () => {
  const { currentUser, token } = useSelector((state) => state.user)

  return (
    <BrowserRouter>
      <ToastContainer autoClose={700} />
      {token && <Header />}

      <Routes>
        {token ? (
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
            <Route path="/listing/:listingId" element={<Listing />} />
            <Route path="/search" element={<Search />} />
            <Route path="/your-listings" element={<YourListings />} />
            <Route path="/saved" element={<SavedListings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chats" element={<ChatList userId={currentUser?._id} />} />
            <Route path="/chat/:chatRoomId" element={<ChatRoom userId={currentUser?._id} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/sign-in" />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/broker-login" element={<BrokerLogin />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
