const mongoose = require("mongoose");

const workshift = new mongoose.Schema(
	{
		day: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "daySchema",
		},
		room: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "roomSchema",
		},
		keeper: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "keeperSchema",
		},
	},
	{ timestamps: true, strict: true }
);

module.exports = mongoose.model(
	"workshiftSchema",
	workshift,
	"workshiftsTable"
);
