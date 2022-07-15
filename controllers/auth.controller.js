const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

// SignUp Controller
exports.signup = (req, res) => {
	const { name, email, password } = req.body;
	// Verifying if one of the fields is Empty
	if (!name || !password || !email) {
		return res.json({ error: "Please submit all required field" });
	}
	// Else we search the user with the credentials submitted
	User.findOne({ Email: email })
		.then((savedUser) => {
			// Verify if the user exist in the DB
			if (savedUser) {
				return res.json({ error: "This Email Is Already Used !" });
			}
			// We Hash the pwd before save into DB, more the number is high more it's more secure
			bcrypt.hash(password, 12).then((hashedPwd) => {
				const user = new User({
					Name: name,
					Email: email,
					Password: hashedPwd,
				});
				// We save our new user to DB
				user.save()
					.then((user) => {
						// after saving the user into DB we send a confirmation email
						res.json({ message: "Saved successfully " });
					})
					.catch((err) => {
						console.log(err);
					});
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// SignIn Controller
exports.signin = (req, res) => {
	const { email, password } = req.body;
	// Verification for an empty field
	if (!email || !password) {
		return res.json({ error: "Please provide Email or Password" });
	}
	// Check if email exist in our DB
	User.findOne({ Email: email })
		.then((savedUser) => {
			if (!savedUser) {
				return res.json({ error: "Invalid Email or Password" });
			}
			bcrypt.compare(password, savedUser.Password).then((doMatch) => {
				if (doMatch) {
					// we will generate the token based on the ID of user
					const token = jwt.sign({ _id: savedUser._id }, "abc123");
					// retrieve the user info details and send it to the front
					const { _id, Name, Email, Followers, Following, Bookmarks } = savedUser;
					res.json({ token, user: { _id, Name, Email, Followers, Following, Bookmarks } });
				} else {
					return res.json({
						error: "Invalid Email or Password",
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// New Password Controller
exports.newPwd = (req, res) => {
	const Password = req.body.password;
	const Token = req.body.token;
	User.findOne({ ResetToken: Token, ExpirationToken: { $gt: Date.now() } })
		.then((user) => {
			if (!user) {
				return res.status(422).json({ error: "Session expired ! Try Again with a new Request" });
			}
			bcrypt.hash(Password, 12).then((HashPwd) => {
				user.password = HashPwd;
				user.ResetToken = undefined;
				user.ExpirationToken = undefined;
				user.save().then((result) => {
					res.json({ message: "Password Updated successfully" });
				});
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
