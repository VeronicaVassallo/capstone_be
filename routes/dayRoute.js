const express = require("express");
const dayModel = require("../models/dayModel");
const dayRouter = express.Router();
const roomModel = require("../models/roomModel");
const workshiftModel = require("../models/workshiftModel");

//Post
dayRouter.post("/day/create", async (req, res) => {
	try {
		const existedDay = await dayModel.find({
			singleDay: req.body.singleDay,
		});
		if (existedDay.length > 0) {
			res.status(200).send({
				statusCode: 200,
				message: "Select another date",
			});
		} else {
			const nameDate = new Date(req.body.singleDay); // questo converte la data da stringa a tipo data
			// riconoscendo la struttura yyyy-MM-dd

			const newDay = new dayModel({
				singleDay: req.body.singleDay,
				dataName: nameDate, //utilizzo dopo per ordinare i giorni in base alla data, nel sort
			});
			//Controllo che non esista già un giorno con la stessa data -> se lo trova, errore

			const dayRequest = await newDay.save();

			const allRooms = await roomModel.find();

			//per ogni stanza creo un turno vuoto
			allRooms.forEach(async (room) => {
				let counter = 0;
				if (room.english === true) counter++;
				if (room.firePrevention === true) counter++;
				if (room.firstAid === true) counter++;

				const newWorkshift = new workshiftModel({
					day: dayRequest._id,
					room: room._id,
					priority: counter,
				});
				const postWorkshiftRequest = await newWorkshift.save();
			});

			res.status(201).send({
				statusCode: 201,
				message: "Day created",
			});
		}
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
		const days = await dayModel.find().sort({ dataName: 1 });

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

//delete
dayRouter.delete("/day/delete/:idDay", async (req, res) => {
	const { idDay } = req.params;
	try {
		const workshiftWithIdDay = await workshiftModel.deleteMany({ day: idDay });
		const deleteDay = await dayModel.findByIdAndDelete(idDay);
		res.status(200).send({
			statusCode: 200,
			message: `Element with id: ${idDay} was deleted `,
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
