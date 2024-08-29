import express from "express";
import multer from "multer";
import Resume from "../models/resume.js";
import User from "../models/user.js";
import path from "path";
import fs from "fs";

const resumeRouter = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = "uploads/";
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, {recursive: true});
		}
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({storage});

resumeRouter.post("/upload", upload.single("file"), async (req, res) => {
	try {		
		const userId = req.user.id;
		
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({error: "User not found"});
		}
		const file = new Resume({
			filename: req.file.filename,
			path: req.file.path,
			user: user._id,
		});

		await file.save();
		res.status(201).json({message: "File uploaded succesfully", file});
	} catch (error) {
		res.status(500).json({error: `File upload failed: ${error}`});
	}
});

resumeRouter.get("/files/:userId", async (req, res) => {
	try {
		const {userId} = req.params;
		const files = await Resume.find({user: userId});

		if (!files || files.length === 0) {
			return res.status(404).json({error: "No files found for this user"});
		}

		res.json(files);
	} catch (error) {
		res.status(500).json({error: `Failed to fetch file: ${error}`});
	}
});

export default resumeRouter;
