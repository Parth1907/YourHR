import {Schema, model} from "mongoose";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
	},
	name: {
		type: String,
		required: true,
	},
	passwordHash: String,
});

userSchema.set("toJSON", {
	transform: (doc, returnedObj) => {
		returnedObj.id = returnedObj._id.toString();
		delete returnedObj._id;
		delete returnedObj.__v;
		delete returnedObj.passwordHash;
	},
});

const User = model("User", userSchema);
export default User;
