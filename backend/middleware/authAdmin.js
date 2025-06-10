import jwt from "jsonwebtoken";
import { error } from "../utils/errorHandler.js";

const authAdmin = async (req, res, next) => {
    try {
        const aToken = req.headers.authorization?.split(" ")[1];

        if (!aToken) {
            return res.status(401).json({ success: false, message: "Not authorized, login again" });
        }

        const tokenDecode = jwt.verify(aToken, process.env.JWT_SECRET);

        if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ success: false, message: "Invalid token, access denied" });
        }

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authAdmin