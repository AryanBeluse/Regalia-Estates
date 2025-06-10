import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess, signInToken } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets.js'

const OAuth = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleAuth = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            await AuthGoogle(result);
            // console.log(result);


        } catch (error) {
            console.log('Google sign-in OAuth error', error);
        }
    };

    const AuthGoogle = async (result) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/google-auth`, {
                username: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL
            });
            // console.log(data);
            toast.success(data.message);

            dispatch(signInSuccess(data.user));
            dispatch(signInToken(data.token))
            navigate('/');

        } catch (error) {
            console.log('Google sign-in API error', error);
        }
    };


    return (
        <button
            onClick={handleGoogleAuth}
            type="button"
            className="flex items-center justify-center gap-3 bg-white text-[#3c4043] border  border-[#dadce0] p-3 rounded-lg hover:opacity-70 cursor-pointer w-full shadow-md "
        >
            <img src={assets.googleIcon} alt="Google Logo" className="w-5 h-5 font-bold" />
            Continue with Google
        </button>
    )
}

export default OAuth
