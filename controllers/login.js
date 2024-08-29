import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import express from "express";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
	const {username, password} = req.body;
	const user = await User.findOne({username});
	
	const passwordCorrect =
		user === null ? false : bcrypt.compare(password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return res.status(401).json({
			error: "invalid username or password",
		});
	}

	const userForToken = {
		username: user.username,
		name: user.name,
		id: user._id,
	};

	const token = jwt.sign(userForToken, process.env.SECRET, {
		expiresIn: 60 * 60,
	});

	res.status(200).send({token, username: user.username, name: user.name, id: user._id.toString()});
});

export default loginRouter;
