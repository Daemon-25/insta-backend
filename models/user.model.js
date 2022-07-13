const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
	Name: {
		type: String,
		required: true,
	},
	Email: {
		type: String,
		required: true,
	},
	Password: {
		type: String,
		required: true,
	},
	ResetToken: { type: String },
	ExpirationToken: { type: Date },
	Photo: {
		type: Buffer,
	},
	PhotoType: {
		type: String,
	},
	Followers: [{
		// FollowerId : {
		type: ObjectId, 
		ref: "User"
	// },
	//  FollowerName:{
	// 	type: String, required:true
	}
// }
],
	Following: [
		// {FollowingId : 
		{
		type: ObjectId, 
		ref: "User"
	},
	//  FollowingName:{
	// 	type: String, required:true
	// }
// }
],
	Bookmarks: [{ type: ObjectId, ref: "Post" }],
});

// Create a model from our schema
module.exports = mongoose.model("User", userSchema);
