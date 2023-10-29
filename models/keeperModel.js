const mongoose = require("mongoose");

const keeper = new mongoose.Schema(
	{
		nameKeeper: {
			type: String,
			required: true,
		},
		surnameKeeper: {
			type: String,
			require: true,
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
		avatar: {
			type: String,
		},
	},
	{ timestamps: true, strict: true }
);
module.exports = mongoose.model("keeperSchema", keeper, "keepersTable");
