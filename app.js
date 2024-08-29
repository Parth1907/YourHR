import "express-async-errors";
import express, {json, urlencoded} from "express";
import cors from "cors";
import userRouter from "./controllers/users.js";
import {mongoUrl} from "./utils/config.js";
import {connect} from "mongoose";
import {
	errorHandler,
	tokenExtractor,
	unknownEndpoint,
	userExtractor,
} from "./utils/middleware.js";
import loginRouter from "./controllers/login.js";
import resumeRouter from "./controllers/resumes.js";
import path from "path";

const app = express();

connect(mongoUrl).then(() => {
	console.log("Connected to MongoDB");
});

const __dirname = import.meta.dirname;

app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("dist"));

app.use(cors());
app.use(json());
app.use(urlencoded({extended: true}));
app.use(tokenExtractor);

app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/resume", userExtractor, resumeRouter);

app.use(errorHandler, unknownEndpoint);

export default app;
