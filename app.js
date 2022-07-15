const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const socket = require("socket.io");

const connectDB = require("./config/db.config");

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Connection to DB
connectDB();

// Create the Express application object
const app = express();

// Compress the HTTP response sent back to a client
app.use(compression()); //Compress all routes

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());

// use Morgan dep in dev mode
app.use(morgan("dev"));

// Set up cors to allow us to accept requests from our client
app.use(
	cors({
		origin: "http://localhost:3000", // <-- location of the react app were connecting to
		credentials: true,
	})
);

// Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- ROUTES ----------------
 */
require("./routes/auth.route")(app);
require("./routes/post.route")(app);
require("./routes/user.route")(app);
require("./routes/messages.route")(app);


app.use('/', (req, res) => {
	res.send("Hello World")
})

/**
 * -------------- SERVER ----------------
 */

// Specify the PORT which will the server running on
const PORT = process.env.PORT || 3001;

// Disabling Powered by tag
app.disable("x-powered-by");

const server = app.listen(PORT, () => {
	console.log(`Server is running under port ${PORT}.`);
});

const io = socket(server, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});


//Socket Initialization for Chatting
global.onlineUsers = new Map();
io.on("connection", (socket) => {
	global.socket = socket;
	socket.on("add-user", (userId) => {
		onlineUsers.set(userId, socket.id);
		
	});

	socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
		
			socket.to(sendUserSocket).emit("msg-recieve", data.message);
		}
	});
});
