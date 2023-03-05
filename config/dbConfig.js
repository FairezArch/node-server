const mongoose = require("mongoose");
const { dbURI } = require("./app");
const connectDB = async() => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(dbURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = connectDB;
