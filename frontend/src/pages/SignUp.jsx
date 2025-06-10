import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess, signInToken } from '../redux/user/userSlice';

const SignUp = () => {
    const [formData, setFormData] = useState({})
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.user)

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
        const { username, email, password } = formData;
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/signup', { username, email, password })
            if (data.success) {

                toast.success('User created successfully!');
                dispatch(signInSuccess(data.user))
                dispatch(signInToken(data.token))

                navigate('/')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
                (signInFailure(error.message))
        }
    }

    return (
        <div className="h-screen flex justify-center items-center ">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-9 rounded-3xl shadow-xl flex w-[90%] max-w-4xl">
                <div className="hidden md:flex flex-col  text-white w-1/2 p-10  space-y-6">
                    <h1 className="text-4xl font-bold">WELCOME</h1>

                    <p className="text-md leading-relaxed">
                        Find your perfect home with ease. Explore top listings, connect with trusted agents, and make informed real estate decisions all in one place.
                    </p>

                    <div className="mt-4 p-4 bg-white text-gray-800 rounded-xl w-fit shadow-md">
                        Are you a Broker?{" "}
                        <Link to="/broker-login" className=" text-blue-600 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>



                <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-1/2">
                    <h1 className="text-3xl text-center font-semibold mb-6">Sign Up</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text" placeholder="name" id="username"
                            onChange={handleChange} className="border p-3 rounded-lg w-full"
                        />
                        <input
                            type="email" placeholder="email" id="email"
                            onChange={handleChange} className="border p-3 rounded-lg w-full"
                        />
                        <input
                            type="password" placeholder="password" id="password"
                            onChange={handleChange} className="border p-3 rounded-lg w-full"
                        />
                        <button className="text-white bg-[#1E3A8A] p-3 rounded-lg hover:opacity-90 w-full shadow-md">
                            Sign Up
                        </button>
                    </form>

                    <div className="flex items-center my-2">
                        <hr className="flex-grow border-gray-300" />
                        <span className="px-3 text-gray-500 text-sm">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>



                    <div className="mt-2">
                        <OAuth />
                    </div>


                    <div className="flex justify-center gap-2 mt-4 text-sm">
                        <p>Have an account?</p>
                        <Link to="/sign-in" className="text-blue-600 hover:underline">Login</Link>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default SignUp
