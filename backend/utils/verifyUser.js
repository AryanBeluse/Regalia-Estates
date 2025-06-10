import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("Received Token:", token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return next(errorHandler(403, 'Forbidden'));

            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

