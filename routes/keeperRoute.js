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

//Get
keeperRouter.get("/keepers/:idRoom", async (req, res) => {
	//ottengo la stanza specifica ---> da cui ottengo i requisiti
	const { idRoom } = req.params;
	const room = await roomModel.findById(idRoom);
	try {
		//confrontare i requisiti della stanza con quella dei vari keepers
		//prendere solo quelli che li soddisfano
		const keepers = await keeperModel.find({
			$and: [
				{ english: { $eq: room.english } },
				{ firePrevention: { $eq: room.firePrevention } },
				{ firstAid: { $eq: room.firstAid } },
			],
		});
		res.status(200).send({
			statusCode: 200,
			message: `Found ${keepers.length}`,
			keepers,
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
