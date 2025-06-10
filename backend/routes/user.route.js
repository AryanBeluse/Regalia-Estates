import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    updateUser,
    saveListing,
    getSavedListings,
    savePreferences,
    getPreferences,
} from '../controllers/user.controller.js';
import {
    getAllPreferences,
    UsersInterestedInBrokerListings
} from '../controllers/broker.controller.js'
import { upload } from "../middleware/multer.middleware.js";


const userRouter = express.Router();

userRouter.put('/update/:id', upload.single('image'), verifyToken, updateUser)
userRouter.post('/save-listing', verifyToken, saveListing)
userRouter.get('/get-saved/:id', verifyToken, getSavedListings)
userRouter.post('/save-preferences', verifyToken, savePreferences)
userRouter.get('/get-preferences/:userId', verifyToken, getPreferences)
userRouter.get('/get-all-preferences', verifyToken, getAllPreferences)
userRouter.get('/get-interested-users/:brokerId', verifyToken, UsersInterestedInBrokerListings)

export default userRouter;