const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successfully");
    } catch (error) {
        console.log("Error in connecting to mongodb", error)
    }
}

module.exports= ConnectDB;
