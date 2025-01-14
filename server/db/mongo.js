// MongoDB connection
const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        const uri = process.env.MONGODB_ATLAS_URI;
        const clientOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: { version: "1", strict: true, deprecationErrors: true },
        };

        const conn = await mongoose.connect(uri, clientOptions);
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;