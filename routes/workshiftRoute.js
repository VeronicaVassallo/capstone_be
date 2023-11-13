const express = require("express");
const workshiftModel = require("../models/workshiftModel");
const roomModel = require("../models/roomModel");
const workshiftRouter = express.Router();
const keeperModel = require("../models/keeperModel");

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

//Get mi devono tornare i turni del keeper specifico
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

//Post che mi deve stampare i keepers selezionati nelle postazioni
//dal frontend mi passo l'array dei keeper selezionati

workshiftRouter.patch("/workshift/:idDay/generator", async (req, res) => {
	const { idDay } = req.params; //id del giorno specifico
	const arrayIdJoined = req.body.arrayIdJoined; //array idKeeper joinati dai ; solo che è una stringa
	try {
		let arrayIdSplited = arrayIdJoined.split(";"); //ritorna array idKeeper

		const workshiftsDay = await workshiftModel
			.find({ day: idDay })
			.sort({ priority: -1 });

		let usedKeepers = [];

		for (const wrk of workshiftsDay) {
			const room = await roomModel.findById(wrk.room._id);

			let keepers = await keeperModel.find({
				$and: [
					{ _id: { $in: arrayIdSplited } },
					{ _id: { $nin: usedKeepers } },
				],
			});

			if (room.english === true) {
				keepers = keepers.filter((keeper) => {
					return keeper.english === true;
				});
			}
			if (room.firePrevention === true) {
				keepers = keepers.filter((keeper) => {
					return keeper.firePrevention === true;
				});
			}
			if (room.firstAid === true) {
				keepers = keepers.filter((keeper) => {
					return keeper.firstAid === true;
				});
			}

			if (keepers.length > 0) {
				const keeperWinner =
					keepers[Math.floor(Math.random() * keepers.length)];

				const updateWrk = await workshiftModel.findByIdAndUpdate(wrk._id, {
					keeper: keeperWinner._id,
				});

				usedKeepers.push(keeperWinner._id);
			}
		}

		res.status(200).send({
			statusCode: 200,
			message: "Keepers associated",
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Error during update" + error.message,
			error,
		});
	}
});

module.exports = workshiftRouter;
