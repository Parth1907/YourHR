import {model, Schema} from "mongoose";

const resumeSchema = new Schema({
	filename: String,
	path: String,
	uploadedAt: {
		type: Date,
		default: Date(),
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

const Resume = model("Resume", resumeSchema);
export default Resume;
