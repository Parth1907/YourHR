import User from "../models/user.js";

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

export {initialBlogs, blogsInDb, usersInDb};
