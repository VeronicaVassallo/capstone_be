const express = require("express");
const dayModel = require("../models/dayModel");
const dayRouter = express.Router();
const roomModel = require("../models/roomModel");
const workshiftModel = require("../models/workshiftModel");

//Post
dayRouter.post("/day/create", async (req, res) => {
	try {
		const newDay = new dayModel({
			singleDay: req.body.singleDay,
		});
		//Controllo che non esista già un giorno con la stessa data -> se lo trova, errore

		const dayRequest = await newDay.save();

		//cerco il giorno --> array
		/*
		const searchDay = await dayModel.find({
			singleDay: req.body.singleDay,
		});
		//id del giorno
		const searchDayId = searchDay[0]._id;
*/
		//cerco tutte le stanze --->array

		const allRooms = await roomModel.find();

		//per ogni stanza creo un turno vuoto
		allRooms.forEach(async (room) => {
			const newWorkshift = new workshiftModel({
				day: dayRequest._id,
				room: room._id,
			});
			const postWorkshiftRequest = await newWorkshift.save();
		});

		res.status(201).send({
			statusCode: 201,
			message: "Day created",
			dayRequest,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Internal server error: " + error.message,
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
