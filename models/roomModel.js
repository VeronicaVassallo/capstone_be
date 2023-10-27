const mongoose = require("mongoose");

const room = new mongoose.Schema(
	{
		nameRoom: {
			type: String,
			required: true,
		},
		english: {
			type: Boolean,
			required: true,
		},
		firePrevention: {
			type: Boolean,
			required: true,
		},
		firstAid: {
			type: Boolean,
			required: true,
		},
		info: {
			type: String,
		},
		cover: {
			type: String,
		},
	},
	{ timestamps: true, strict: true }
);

module.exports = mongoose.model("roomSchema", room, "roomsTable");
