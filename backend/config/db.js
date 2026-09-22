import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI is not defined in the environment variables");
    }

    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
}