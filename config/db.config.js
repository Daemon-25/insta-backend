const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://sagar:1234@cluster0.4z0mt.mongodb.net/?retryWrites=true&w=majority"


const connectDB = async () => {
	try {
		mongoose.connect(mongoURI,()=>{
			console.log("connected to mongo successfully");
		})
	} catch (err) {
		console.log("error while connecting to your DataBase : ", err);
		process.exit(1);
	}
};

module.exports = connectDB;
