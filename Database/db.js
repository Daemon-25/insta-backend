const mongoose = require('mongoose');

const connectToMongo = async () => {
    mongoose.connect(process.env.DB_URL).then( () => {
        console.log("Connection to MongoDB Successful!");
    }).catch( err => console.log("No Connection"))
}

module.exports = connectToMongo;