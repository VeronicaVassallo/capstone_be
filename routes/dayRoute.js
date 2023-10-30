const express = require("express");
const dayModel = require("../models/dayModel");
const dayRouter = express.Router();

//Post
dayRouter.post("/day/create", async (req, res) => {
	const newDay = new dayModel({
		singleDay: req.body.singleDay,
	});
	try {
		//Controllo che non esista già un giorno con la stessa data -> se lo trova, errore

		const postRequest = newDay.save();

		res.status(201).send({
			statusCode: 201,
			message: "Day created",
			postRequest,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Internal server error",
			error,
		});
	}
});

//GET
dayRouter.get("/day", async (req, res) => {
	try {
		const days = await dayModel.find();

		res.status(200).send({
			statusCode: 200,
			message: `Found ${days.length} elements`,
			days,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Internal server error",
			error,
		});
	}
});

//Get specific date

dayRouter.get("/day/:singleDay", async (req, res) => {
	try {
		const { singleDay } = req.params;
		const daySpecific = await dayModel.find({
			singleDay: singleDay,
		});

		res.status(200).send({
			statusCode: 200,
			message: `Found element with date ${singleDay} `,
			daySpecific,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: `Internal server error${error}`,
			error,
		});
	}
});
module.exports = dayRouter;
