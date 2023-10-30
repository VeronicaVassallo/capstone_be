const express = require("express");
const workshiftModel = require("../models/workshiftModel");
const workshiftRouter = express.Router();

//Post

workshiftRouter.post("/workshift/create", async (req, res) => {
	const newWorkshift = new workshiftModel({
		day: req.body.day,
		room: req.body.room,
		keeper: "",
	});
	try {
		const postWorkshift = newWorkshift.save();
		res.status(201).send({
			statusCode: 201,
			message: "Workshift created",
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: `Internal server error: ${error}`,
			error,
		});
	}
});

module.exports = workshiftRouter;
