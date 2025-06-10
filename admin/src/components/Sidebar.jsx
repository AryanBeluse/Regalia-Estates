import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext.jsx'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'


const Sidebar = () => {

    const { aToken } = useContext(AdminContext)


    return (
        <div className='min-h-screen bg-white border-r flex flex-col'>
            {
                aToken && <ul className='text-[#515151]  flex-grow'>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72  cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={'/dashboard'}>
                        <img src={assets.home_icon} alt="" />
                        <p>Dashboard</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72  cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={'/user-pref'}>
                        <img src={assets.people_icon} alt="" />
                        <p>Users Preferences</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72  cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={'/create-listing'}>
                        <img src={assets.add_icon} alt="" />
                        <p>Create Listing</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72  cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={'/add-broker'}>
                        <img src={assets.add_icon} alt="" />
                        <p>Add Broker</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72  cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={'/users'}>
                        <img src={assets.people_icon} alt="" />
                        <p>All Users</p>
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72  cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}
                        to={'/listings'}>
                        <img src={assets.appointment_icon} alt="" />
                        <p>All Listings</p>
                    </NavLink>

                </ul>
            }
        </div>
    )
}

export default Sidebar
