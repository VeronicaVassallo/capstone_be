const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcrypt");
const keeperModel = require("../models/keeperModel");

const jwt = require("jsonwebtoken");
require("dotenv").config();

loginRouter.post("/login", async (req, res) => {
	const keeper = await keeperModel.findOne({ email: req.body.email });

	if (!keeper) {
		return res.status(404).send({
			message: "Keeper don't found",
			statusCode: 404,
		});
	}

	const validPassword = await bcrypt.compare(
		req.body.password,
		keeper.password
	);

	if (!validPassword) {
		return res.status(400).send({
			statusCode: 400,
			message: "Incorrect Email or password ",
		});
	}

	//generiamo il token:CONTINUA
	const token = jwt.sign(
		{
			_id: keeper._id,
			nameKeeper: keeper.nameKeeper,
			surnameKeeper: keeper.surnameKeeper,
			email: keeper.email,
			referent: keeper.referent,
			english: keeper.english,
			firePrevention: keeper.firePrevention,
			firstAid: keeper.firstAid,
			avatar: keeper.avatar,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "24h",
		}
	);

	res.header("Authorization", token).status(200).send({
		message: "Login effetuato con successo",
		statusCode: 200,
		token,
	});
});

module.exports = loginRouter;
