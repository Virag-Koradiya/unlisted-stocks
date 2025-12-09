import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const makeCookieOptions = (maxAgeMs = 24 * 60 * 60 * 1000) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // if cross-site in prod, use 'none'
  maxAge: maxAgeMs,
});

export const register = async (req, res) => {
    try {
        let { fullname, email, phoneNumber, password } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        email = String(email).trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;
        try {
            newUser = await User.create({
                fullname: String(fullname).trim(),
                email,
                phoneNumber,
                password: hashedPassword,
            });
        } catch (createErr) {
            if (createErr.code === 11000 && createErr.keyPattern && createErr.keyPattern.email) {
                return res.status(409).json({ message: 'User already exists with this email.', success: false });
            }
            throw createErr;
        }

        return res.status(201).json({ message: "Account created successfully.", user: {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber
        }, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password ) {
      return res.status(400).json({
        message: 'Email and password are required.',
        success: false,
      });
    }

    email = String(email).trim().toLowerCase();

    const user = await User.findOne({ email });
    const invalidCredsMsg = 'Incorrect email or password.';

    if (!user) {
      return res.status(400).json({ message: invalidCredsMsg, success: false });
    }

    if (!user.password) {
      return res.status(400).json({ message: invalidCredsMsg, success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: invalidCredsMsg, success: false });
    }

    const tokenPayload = {
      userId: user._id.toString()
    };

    const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, { expiresIn: '1d' });

    // Prepare sanitized user object
    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    // Set cookie and respond
    return res
      .status(200)
      .cookie('token', token, makeCookieOptions(24 * 60 * 60 * 1000)) // 1 day
      .json({
        message: `Welcome back ${safeUser.fullname || ''}`.trim(),
        user: safeUser,
        success: true,
      });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      success: false,
    });
  }
};


export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie('token', '', { ...makeCookieOptions(0), expires: new Date(0) })
      .json({ message: 'Logged out successfully.', success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Logout failed.', success: false });
  }
};