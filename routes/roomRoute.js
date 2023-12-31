const express = require("express");
const roomModel = require("../models/roomModel");
const roomRouter = express.Router();
const validatorRoom = require("../middlewares/validatorRoom");

//POST

roomRouter.post("/room/create", validatorRoom, async (req, res) => {
	const newRoom = new roomModel({
		nameRoom: req.body.nameRoom,
		english: Boolean(req.body.english),
		firePrevention: Boolean(req.body.firePrevention),
		firstAid: Boolean(req.body.firstAid),
		info: req.body.info,
		cover: req.body.cover,
	});
	try {
		const postRequest = newRoom.save();
		res.status(201).send({
			statusCode: 201,
			message: "Room created",
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
roomRouter.get("/rooms", async (req, res) => {
	try {
		const rooms = await roomModel.find();
		res.status(200).send({
			statusCode: 200,
			message: `Found ${rooms.length} elements`,
			rooms,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Internal server error",
			error,
		});
	}
});

// Get della room specifica

roomRouter.get("/room/:idRoom", async (req, res) => {
	try {
		const { idRoom } = req.params;
		const roomById = await roomModel.findById(idRoom);

		res.status(200).send({
			statusCode: 200,
			message: `Room with id : ${idRoom} found`,
			roomById,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Internal server error",
			error,
		});
	}
});

module.exports = roomRouter;
