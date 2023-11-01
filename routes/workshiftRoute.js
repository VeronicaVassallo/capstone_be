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

//Get

workshiftRouter.get("/workshift/:idDay", async (req, res) => {
	try {
		const { idDay } = req.params;
		const workshift = await workshiftModel
			.find({
				day: idDay,
			})
			.populate(["room", "day", "keeper"]);

		res.status(200).send({
			statusCode: 200,
			message: `Found ${workshift.length} elements`,
			workshift,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Internal server error",
			error,
		});
	}
});

module.exports = workshiftRouter;
