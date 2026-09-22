import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer')) {
        token = header.split(' ')[1];
    }
    if (!token) {
        throw new ApiError(401, "Not authorized to access this route,no token provided");
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiError(401, "Not authorized to access this route, token is invalid or expired");
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        throw new ApiError(401, "Not authorized to access this route, user not found");
    }
    req.user = user;
    next();
});