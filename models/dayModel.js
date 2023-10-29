const mongoose = require("mongoose");

const day = new mongoose.Schema(
	{
		singleDay: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, strict: true }
);
module.exports = mongoose.model("daySchema", day, "daysTable");
