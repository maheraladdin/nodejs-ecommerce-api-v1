// Desc: This file is used to connect to the database

// import mongoose
const mongoose = require('mongoose');


/**
 * @desc    This function is used to handle mongoose connection errors
 * @param   {Function} callback - callback function
 * @return  {Promise<void>}
 */
const mongooseConnectionAsyncHandler = async (callback) => {
    try {
        await callback();
    } catch (error) {
        console.log(error);
    }
};

/**
 * @desc This function is used to connect to the database
 * @return {Promise<void>}
 */
const mongooseConnection = async () => {
    const conn = await mongoose.connect(process.env.DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Database connected successfully at host: ${conn.connection.host}`);
};


module.exports = () => mongooseConnectionAsyncHandler(mongooseConnection);