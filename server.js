const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const roomRouter = require("./routes/roomRoute");
const dayRouter = require("./routes/dayRoute");

const PORT = 5050;

const app = express();

//middleware
app.use(express.json());

//routes
app.use("/", dayRouter);
app.use("/", roomRouter);

mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error during db connection"));
db.once("open", () => {
	console.log("Database successfully connected");
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
