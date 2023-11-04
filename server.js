const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const roomRouter = require("./routes/roomRoute");
const dayRouter = require("./routes/dayRoute");
const keeperRouter = require("./routes/keeperRoute");
const workshiftRouter = require("./routes/workshiftRoute");
const loginRouter = require("./routes/loginRoute");
const PORT = 5050;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/", dayRouter);
app.use("/", roomRouter);
app.use("/", keeperRouter);
app.use("/", workshiftRouter);
app.use("/", loginRouter);

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
