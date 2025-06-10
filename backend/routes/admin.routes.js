import express from 'express';
import {
    deleteListing,
    deleteUser,
    getAllListings,
    getAllUsers,
    handleVerified
} from '../controllers/admin.controller.js';
import { getUserListings } from '../controllers/listing.controller.js';
import authAdmin from '../middleware/authAdmin.js';

const adminRouter = express.Router();

adminRouter.get("/listings", authAdmin, getAllListings)
adminRouter.get("/users", authAdmin, getAllUsers)
adminRouter.patch("/verify/:id", authAdmin, handleVerified)
adminRouter.delete("/user/:id", authAdmin, deleteUser)
adminRouter.delete("/listing/:id", authAdmin, deleteListing)
adminRouter.get("/userListings/:id", authAdmin, getUserListings)

export default adminRouter;