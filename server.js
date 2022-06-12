const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

const PORT = process.env.PORT || 5000;
const connectToMongo = require('./Database/db.js');

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config({ path : './.env'})

//Create the Express Application Object
const app = express();

//Connection to DB
connectToMongo();

//Compress the response
app.use(compression);

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());

// use Morgan dep in dev mode
app.use(morgan("dev"));

//Parsers
app.use(express.urlencoded({ extended : true }));
app.use(express.json({ limit : "50mb" }));

// Set up cors to allow us to accept requests from our client
app.use(cors({
    origin : "http://localhost:3000",
    credentials : true
}));

app.get('/', (req, res) => {
    res.send("Hello World!");
})

/*
        ROUTES
*/
/* app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/post', require('./Routes/postRoutes')); */

// Disabling Powered by tag
app.disable("x-powered-by");

app.listen(PORT, ()=> {
    console.log(`Server is running under port ${PORT}.`);
})