import jwt from "jsonwebtoken";
const unknownEndpoint = (request, response) => {
	response.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (err, request, response, next) => {
	console.error(err.message);

	if (err.name === "CastError") {
		return response.status(400).send({error: "malformatted id"});
	} else if (err.name === "ValidationError") {
		return response.status(400).json({error: err.message});
	} else if (
		err.name === "MongoServerError" &&
		err.message.includes("E11000 duplicate key error")
	) {
		return response
			.status(400)
			.json({error: "expected `username` to be unique"});
	} else if (err.name === "JsonWebTokenError") {
		return response.status(401).json({error: "token invalid"});
	} else if ((err.name = "TokenExpiredError")) {
		return response.status(401).json({
			error: "token expired",
		});
	}
	next(err);
};

const tokenExtractor = (req, res, next) => {
	const authorization = req.get("authorization");

	if (authorization && authorization.startsWith("Bearer ")) {
		req.token = authorization.replace("Bearer ", "");
	} else {
		req.token = null;
	}
	next();
};

const userExtractor = (req, res, next) => {
	if (req.token) {
		const decodedToken = jwt.verify(req.token, process.env.SECRET);
		if (!decodedToken.id) {
			return response.status(401).json({error: "token invalid"});
		}
		req.user = {
			id: decodedToken.id,
			name: decodedToken.name,
			username: decodedToken.username,
		};
	} else {
		req.user = null;
	}
	next()
};

export {unknownEndpoint, errorHandler, tokenExtractor, userExtractor};
