import User from "../models/user.model.js";
import validator from "validator";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { error } from "../utils/errorHandler.js";

const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next(error(400, "All credentials are required"));
        }

        if (!validator.isEmail(email)) {
            return next(error(400, "Invalid email format"));
        }

        if (password.length < 8) {
            return next(error(400, "Please enter a password with a minimum length of 8"));
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const userData = {
            username,
            email,
            password: hashedPassword
        };

        const newUser = new User(userData);
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;

        return res.status(201).cookie('access_token', token, { httpOnly: true })
            .json({
                success: true,
                message: 'User created successfully',
                user: rest,
                token,
            });
    } catch (err) {
        console.error(err);
        next(err);
    }
};


const signin = async (req, res, next, requireBroker = false) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(error(400, "All fields are required"));
        }

        if (!validator.isEmail(email)) {
            return next(error(400, "Invalid email format"));
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            return next(error(401, "User not found"));
        }
        if (requireBroker && !user.isBroker) {
            return next(error(401, "Not a Broker Account!"));
        }
        if (!requireBroker && user.isBroker) {
            return next(error(401, "Brokers must log in via the broker login!"));
        }
        const firstName = user.username ? user.username.split(' ')[0] : 'User'
        const message = `Welcome Back ${firstName}!`
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return next(error(401, "Incorrect password"));
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...userData } = user._doc;
        return res.status(200).cookie('access_token', token, { httpOnly: true, secure: false })
            .json({
                success: true,
                message,
                user: userData,
                token,
            })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const signinUser = (req, res, next) => signin(req, res, next, false);

const signinBroker = (req, res, next) => signin(req, res, next, true);

const googleAuth = async (req, res, next) => {
    try {
        const { username, email, avatar } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        let user = await User.findOne({ email });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
        };

        if (user) {
            const firstName = user.username ? user.username.split(' ')[0] : 'User';
            const message = `Welcome Back ${firstName}!`;

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...userData } = user._doc;

            return res.status(200).cookie('access_token', token, cookieOptions).json({
                success: true,
                message,
                user: userData,
                token,
            });
        } else {
            const generatedPass = Math.random().toString(36).slice(-8);

            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(generatedPass, salt);

            const newUser = new User({
                username: username || "user",
                email,
                password: hashedPassword,
                avatar,
            });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...userData } = newUser._doc;

            return res.status(201).cookie('access_token', token, cookieOptions).json({
                success: true,
                user: userData,
                message: 'Signed-up successfully',
                token,
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const aToken = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, aToken })
        } else {
            next(error(400, 'Invalid Credentials'));
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


export {
    signup,
    signinUser,
    signinBroker,
    googleAuth,
    loginAdmin
};
