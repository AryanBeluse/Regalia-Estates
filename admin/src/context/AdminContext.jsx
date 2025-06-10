import { createContext, useState, useEffect } from "react";
import axios from "axios"
import { toast } from 'react-toastify'


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : false)
    const [listings, setListings] = useState([])
    const [users, setUsers] = useState([])




    const getListings = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/listings`, {
                headers: {
                    Authorization: `Bearer ${aToken}`
                }
            })
            if (data.success) {
                setListings(data.listings)
            }
        } catch (error) {
            console.log(error, "adminContext");
        }
    }

    const getUsers = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
                headers: {
                    Authorization: `Bearer ${aToken}`
                }
            })
            if (data.success) {
                setUsers(data.users)
            }
        } catch (error) {
            console.log(error, "adminContext");
        }
    }

    const deleteUser = async (id) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/admin/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${aToken}`,
                },
            });
            if (data.success) {
                setUsers(prev => prev.filter(user => user._id !== id))
                toast.success('User deleted successfully');
            }
        } catch (error) {
            console.log(error, "adminContext");
        }
    };

    const deleteListing = async (id) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/admin/listing/${id}`, {
                headers: {
                    Authorization: `Bearer ${aToken}`,
                },
            });
            if (data.success) {
                setListings(prev => prev.filter(user => user._id !== id))
                toast.success('Listing deleted successfully');
            }
        } catch (error) {
            console.log(error, "adminContext");
        }
    };

    const toggleVerify = async (id) => {
        try {
            const { data } = await axios.patch(`${backendUrl}/api/admin/verify/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${aToken}`,
                },
            });
            if (data.success) {
                toast.success('Verification toggled successfully');
                setListings((prevListings) =>
                    prevListings.map((listing) =>
                        listing._id === id
                            ? { ...listing, verified: !listing.verified }
                            : listing
                    )
                );
            }
        } catch (error) {
            console.log(error, "adminContext");
        }
    };

    const formatIndianCurrency = (number) => {
        if (number >= 10000000) {
            return (number / 10000000).toFixed(2) + ' Cr';
        } else if (number >= 100000) {
            return (number / 100000).toFixed(2) + ' Lakh';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(2) + 'K';
        } else {
            return number.toString();
        }
    };




    // useEffect(() => {
    //     if (aToken) {
    //         localStorage.setItem('aToken', aToken);

    //     }
    // }, [aToken]);

    useEffect(() => {
        if (aToken) {
            localStorage.setItem('aToken', aToken);
            getListings()
            getUsers()

        }
    }, [aToken]);





    const value = {
        backendUrl,
        aToken, setAToken,
        listings, setListings,
        users, setUsers,
        getListings,
        getUsers,
        deleteUser,
        deleteListing,
        toggleVerify,
        formatIndianCurrency

    }


    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider