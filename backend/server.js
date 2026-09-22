import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import noteRoutes from "./routes/note.routes.js";
import taskRoutes from "./routes/task.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// Middleware
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
    }
));




app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "production") app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running", service: "AI CRM Dashboard" })
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/notes",noteRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/contacts",contactRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/analytics",analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 8001;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error.message || error);
        if (error.message && (error.message.includes("SSL alert number 80") || error.message.includes("tlsv1 alert internal error"))) {
            console.error("\n[MongoDB Atlas Hint]: SSL alert 80 indicates that MongoDB Atlas rejected the connection. This almost always means your current public IP address is not whitelisted in MongoDB Atlas Network Access. Whitelist your IP (or 0.0.0.0/0) in cloud.mongodb.com -> Network Access.");
        }
        if (error.reason && error.reason.servers) {
            console.error("\nServer connection details:");
            for (const [address, server] of error.reason.servers.entries()) {
                console.error(`- ${address}:`, server.error ? (server.error.message || server.error) : "No response from server");
            }
        }
        process.exit(1);
    }
};

start();

export default app;