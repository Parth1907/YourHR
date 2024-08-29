import bcrypt from "bcrypt";
import User from "../models/user.js";
import {test, after, beforeEach, describe} from "node:test";
import assert from "assert";
import supertest from "supertest";
import {usersInDb} from "./test_helper.js";
import app from "../app.js";
import mongoose from "mongoose";

const api = supertest(app);
const baseUrl = "/api/users";

describe("when there is initially one user in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash("sekret", 10);
		const user = new User({username: "root", name: "root", passwordHash});

		await user.save();
	});
	test("creation of user succeeds with a fresh username", async () => {
		const usersAtStart = await usersInDb();

		const newUser = {
			username: "john",
			name: "john",
			password: "john123",
		};

		await api
			.post(baseUrl)
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await usersInDb();

		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		assert(usernames.includes(newUser.username));
	});

	test("creation fails with proper statuscode and message if username already taken", async () => {
		const usersAtStart = await usersInDb();

		const newUser = {
			username: "root",
			name: "Superuser",
			password: "salein",
		};

		const result = await api
			.post(baseUrl)
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await usersInDb();
		assert(result.body.error.includes("expected `username` to be unique"));

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});
	after(async () => {
		await mongoose.connection.close();
	});
});
