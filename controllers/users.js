import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
	const users = await User.find({});
	return res.status(200).json(users);
});

userRouter.post("/", async (req, res) => {
	if (!req.body.password && req.body.password.length > 3) {
		return res.status(400).json({
			error: "Password is required and its length must be greater than 3",
		});
	}
	const {username, name, password} = req.body;

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();

	res.status(201).json(savedUser);
});

export default userRouter;
