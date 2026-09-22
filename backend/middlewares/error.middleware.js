import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, res, next) => {
    const error = new ApiError(404, `Not Found - ${req.method} ${req.originalUrl}`);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if(err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }

    if(err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `Duplicate ${field} value entered: ${JSON.stringify(err.keyValue)}`;
    }

    if(process.env.NODE_ENV !== "production" && statusCode === 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
} 