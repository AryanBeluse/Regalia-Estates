import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'


const Navbar = () => {

    const { aToken, setAToken } = useContext(AdminContext)

    const navigate = useNavigate()

    const logout = () => {

        if (aToken) {
            setAToken('');
            localStorage.removeItem('aToken');
        }


        navigate('/sign-in');
    };


    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white shadow-sm">

            <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 cursor-pointer">
                    <h1 className="text-3xl font-bold king-wide sm:text-3xl md:text-3xl text-gray-900 cursor-pointer"
                        onClick={() => navigate("/dashboard")}>
                        <span className="text-black">Regalia</span>
                        <span className="text-blue-700"> Estates</span>
                    </h1>
                </div>
                <p className="border px-2.5 py-0.5 rounded-full items-center border-gray-500 text-gray-600 text-xs sm:text-xs
                md:text-xs">
                    Admin
                </p>
            </div>


            <button
                onClick={logout}
                className="bg-blue-500 text-white text-sm px-6 sm:px-10 py-2 rounded-full hover:bg-blue-600 transition"
            >
                Logout
            </button>
        </div>
    );
}

export default Navbar
