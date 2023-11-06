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

//Get mi devono tornare i turni del keeper specifico SEI ARRIVATA FINO A QUI!!!
workshiftRouter.get("/workshift/specific/:idkeeper", async (req, res) => {
	try {
		const { idkeeper } = req.params;
		const workshifstSpecificKeeper = await workshiftModel
			.find({
				keeper: idkeeper,
			})
			.populate(["room", "day", "keeper"]);

		res.status(200).send({
			statusCode: 200,
			message: `Found ${workshifstSpecificKeeper.length} elements`,
			workshifstSpecificKeeper,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Internal server error",
			error,
		});
	}
});

//Patch assegnare id del keeper al turno
workshiftRouter.patch("/workshift/:idWorkshift/keeper", async (req, res) => {
	const { idWorkshift } = req.params;
	try {
		const workshiftPatched = await workshiftModel.findByIdAndUpdate(
			idWorkshift,
			{
				keeper: req.body.keeper,
			}
		);
		res.status(200).send({
			statusCode: 200,
			message: "Workshift patched!",
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Error during update" + error.message,
			error,
		});
	}
});

//Patch rimuovi id del keeper al turno
workshiftRouter.patch(
	"/workshift/:idWorkshift/keeper/remove",
	async (req, res) => {
		const { idWorkshift } = req.params;
		try {
			const workshiftPatched = await workshiftModel.findByIdAndUpdate(
				idWorkshift,
				{
					keeper: null,
				}
			);
			res.status(200).send({
				statusCode: 200,
				message: "Workshift removed!",
			});
		} catch (error) {
			res.status(500).send({
				statusCode: 500,
				message: "Error during update" + error.message,
				error,
			});
		}
	}
);

module.exports = workshiftRouter;
