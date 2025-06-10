import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { signOutUserSuccess, signOutUserStart, signOutUserFailure } from '../redux/user/userSlice.js';

const Header = () => {
    const { currentUser, token } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    // console.log(currentUser);
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')

    const handleSignOut = () => {
        dispatch(signOutUserStart())
        dispatch(signOutUserSuccess())
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    return (
        <header >
            <div className='flex items-center justify-between max-w-7xl mx-auto py-2 '>
                <div className="flex items-center gap-2">
                    <h1
                        className="text-3xl font-bold king-wide sm:text-3xl md:text-3xl text-gray-900 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <span className="text-black">Regalia</span>
                        <span className="text-blue-700"> Estates</span>
                    </h1>

                    {currentUser?.isBroker && (
                        <span className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 text-xs">
                            Broker
                        </span>
                    )}
                </div>


                <form onSubmit={handleSearch}
                    className='bg-slate-100 border border-gray-300 p-3 rounded-full flex items-center'>
                    <input
                        type="text"
                        placeholder='  Search...'
                        className='bg-transparent focus:outline-none px-4 w-40 sm:w-[500px]'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className='hover:border border-gray-400 rounded-full px-1.5 py-0.5' >
                        <FaSearch className='text-slate-600 '
                            title='search' />
                    </button>

                </form>

                <ul className='flex items-center gap-9'>
                    <li>
                        <Link to='/' className='hidden sm:inline font-semibold text-slate-700 hover:underline'>
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link to='/chats' className='hidden sm:inline font-semibold text-slate-700 hover:underline'>
                            Chats
                        </Link>
                    </li>

                    {currentUser ? (
                        <div className='relative group'>
                            <img
                                className='rounded-full h-8 w-8 object-cover cursor-pointer'
                                src={currentUser.avatar}
                                alt="Profile"
                                onClick={() => navigate("/profile")}
                            />


                            <div className='absolute right top-full mt-0.5 w-40 bg-white shadow-lg rounded-md  hidden group-hover:block z-10'>
                                <Link to="/profile" className='block px-4 py-2 hover:bg-gray-100 text-gray-700'>
                                    My Profile
                                </Link>
                                <button className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700'
                                    onClick={() => {
                                        handleSignOut();
                                        navigate("/sign-in");
                                    }} >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <li>
                            <Link to='/sign-in' className='text-slate-700 hover:underline'>
                                Sign In
                            </Link>
                        </li>
                    )}
                </ul>
            </div >
        </header >
    )
}

export default Header
