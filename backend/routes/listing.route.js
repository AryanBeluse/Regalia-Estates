import express from 'express';
import {
    createListing,
    getUserListings,
    deleteListings,
    editListings,
    getListings,
    getSearchResults
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { upload } from '../middleware/multer.middleware.js';


const listingRouter = express.Router();

listingRouter.post('/create-listing', upload.array('imageUrl', 4), verifyToken, createListing)
listingRouter.get('/userListings/:id', verifyToken, getUserListings)
listingRouter.delete('/delete/:id', verifyToken, deleteListings)
listingRouter.post('/edit/:id', upload.array('imageUrl', 4), verifyToken, editListings)
listingRouter.get('/get/:id', getListings)
listingRouter.get('/search', getSearchResults)






export default listingRouter;