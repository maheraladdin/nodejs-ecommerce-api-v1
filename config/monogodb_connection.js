// Desc: This file is used to connect to the database

// import mongoose
const mongoose = require('mongoose');

// connect to database
module.exports = () => mongoose
    .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((conn) => {
    console.log(`Database connected successfully at host: ${conn.connection.host}`);
});
