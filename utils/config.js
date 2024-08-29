import {configDotenv} from "dotenv";
configDotenv();
const mongoUrl =
	process.env.NODE_ENV === "test"
		? process.env.TEST_MONGODB_URI
		: process.env.MONGODB_URI;
const PORT = process.env.PORT || 3003;
export {mongoUrl, PORT};
