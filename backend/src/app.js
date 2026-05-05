import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { startReminderCron } from "./utils/reminderCron.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import semesterRoutes from "./routes/semester.routes.js";
import timetableRoutes from "./routes/timetable.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/semesters", semesterRoutes);
app.use("/api/v1/timetable", timetableRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/v1/ai", aiRoutes);

startReminderCron();

export default app;
