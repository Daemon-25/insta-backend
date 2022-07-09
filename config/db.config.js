const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/instagram?readPreference=primary&appname=MongoDB%20Compass&ssl=false"


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
