import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { signInStart, signInFailure, signInSuccess, signInToken } from '../redux/user/userSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth.jsx'

const SignIn = () => {
    const [formData, setFormData] = useState({})
    const { loading, error } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.id]: e.target.value
            }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(signInStart())
        const { email, password } = formData;
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/signin-broker', { email, password })
            if (data.success) {

                toast.success(data.message);


                dispatch(signInSuccess(data.user))
                dispatch(signInToken(data.token))

                navigate('/')
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Something went wrong';
            dispatch(signInFailure(error.message));
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    }


    return (
        <div className="h-screen flex justify-center items-center ">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-9 rounded-3xl shadow-xl flex w-[90%] max-w-4xl">


                <div className="hidden md:flex flex-col text-white w-1/2 p-10">
                    <h1 className="text-4xl font-bold">WELCOME</h1>
                    <p className="mt-3 text-md">
                        Find your perfect home with ease. Explore top listings, connect with trusted agents, and make informed real estate decisions all in one place
                    </p>
                    <div className="mt-4 p-4 bg-white text-gray-800 rounded-xl w-fit shadow-md">
                        Are you a User?{" "}
                        <Link to="/sign-in" className=" text-blue-600 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>


                <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-1/2">
                    <h1 className="text-3xl text-center font-semibold mb-6">Broker Login</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <input
                            type="email" placeholder="Email" id="email"
                            onChange={handleChange} className="border p-3 rounded-lg w-full"
                        />
                        <input
                            type="password" placeholder="Password" id="password"
                            onChange={handleChange} className="border p-3 rounded-lg w-full"
                        />
                        <button className='text-white bg-[#1E3A8A] p-3 rounded-lg hover:opacity-90 w-full shadow-md'
                            disabled={loading}>
                            {loading ? 'Logging In...' : 'Login'}
                        </button>
                    </form>

                    <div className="flex items-center my-2">
                        <hr className="flex-grow border-gray-300" />
                        <span className="px-3 text-gray-500 text-sm">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <div className="flex justify-center gap-2 mt-4 text-sm">
                        <p>Want to join as an broker?</p>
                        <Link to="/sign-up" className="text-blue-600 hover:underline">send request</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn
