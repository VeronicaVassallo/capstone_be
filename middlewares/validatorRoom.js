const validatorRoom = (req, res, next) => {
	const errors = [];

	const { nameRoom, english, firePrevention, firstAid, info, cover } = req.body;

	if (typeof nameRoom !== "string") {
		errors.push("nameRoom must be a string");
	}
	if (typeof english !== "boolean") {
		errors.push("english must be a boolean");
	}
	if (typeof firePrevention !== "boolean") {
		errors.push("firePrevention must be a boolean");
	}
	if (typeof firstAid !== "boolean") {
		errors.push("firstAid must be a boolean");
	}
	if (typeof info !== "string") {
		errors.push("info must be a string");
	}
	if (typeof cover !== "string") {
		errors.push("cover must be a string");
	}
	if (errors.length > 0) {
		res.status(400).send({ errors });
	} else {
		next();
	}
};

module.exports = validatorRoom;
