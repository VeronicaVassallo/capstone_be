const express = require("express");
const keeperModel = require("../models/keeperModel");
const workshiftModel = require("../models/workshiftModel");
const roomModel = require("../models/roomModel");
const keeperRouter = express.Router();

//Post
keeperRouter.post("/keeper/create", async (req, res) => {
	const newKeeper = new keeperModel({
		nameKeeper: req.body.nameKeeper,
		surnameKeeper: req.body.surnameKeeper,
		english: Boolean(req.body.english),
		firePrevention: Boolean(req.body.firePrevention),
		firstAid: Boolean(req.body.firstAid),
		avatar: req.body.avatar,
	});

	try {
		const postKeeper = newKeeper.save();
		res.status(201).send({
			statusCode: 201,
			message: "Keeper created",
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: `Internal server error: ${error}`,
			error,
		});
	}
});

keeperRouter.get("/keepers/:idRoom/:idDay", async (req, res) => {
	//ottengo la stanza specifica ---> da cui ottengo i requisiti
	const { idRoom } = req.params;
	const { idDay } = req.params;
	const room = await roomModel.findById(idRoom);

	//cerco i turni che hanno il keeper e il giorno assegnato
	const workshift = await workshiftModel.find({
		keeper: { $ne: null }, //no null
		day: idDay,
	});
	//id dei keeper che sono stati assegnati, infatti li prendo dai turni
	const listKeepersUsed = workshift.map((work) => {
		return work.keeper._id;
	});

	//cerca i keeper non ancora assegnati escludendo da quelli trovati sopra
	let keepers = await keeperModel.find({ _id: { $nin: listKeepersUsed } });
	let keepersFiltered = [];

	//triplo filtro in base ai requisiti dei keepers in confronto con la stanza
	//Prendono in considerazione solo ai valori true del requisito
	try {
		if (room.english === true) {
			keepersFiltered = keepers.filter((keeper) => {
				return keeper.english === true;
			});
		}
		if (room.firePrevention === true) {
			keepersFiltered = keepers.filter((keeper) => {
				return keeper.firePrevention === true;
			});
		}
		if (room.firstAid === true) {
			keepersFiltered = keepers.filter((keeper) => {
				return keeper.firstAid === true;
			});
		}

		//filtro quelli che non soddisfano i requisiti

		const idKeepersOk = keepersFiltered.map((ok) => {
			return ok._id;
		});

		let keepersExcluded = keepers.filter((no) => {
			return !idKeepersOk.includes(no._id);
		});

		res.status(200).send({
			statusCode: 200,
			message: `Found ${keepersFiltered.length}`,
			keepersFiltered,
			keepersExcluded,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: `Internal server error: ${error}`,
			error,
		});
	}
});

module.exports = keeperRouter;
