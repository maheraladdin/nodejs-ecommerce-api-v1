// require modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// require routes
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');

// require middlewares
const errorHandler = require('./middlewares/errorHandlerMW');
const requestError = require("./utils/requestError");

// load env variables from config.env
dotenv.config({ path: './config.env' });

// connect to database
require('./config/monogodb_connection')();

// initialize express app
const app = express();

// use middlewares

// use morgan for logging requests in development mode
process.env.NODE_ENV === "development" && app.use(morgan('dev')) && console.log('Morgan enabled for development');

// @desc: Use this middleware to parse json data from request body
app.use(express.json());

// @desc: Use this middleware to parse urlencoded data from request body
app.use(express.urlencoded({ extended: true }));

// mainPath
const mainPath = "/api/v1"

// @desc: Mount routes
// @usage: use this middleware to mount routes
app.use(`${mainPath}/categories`,categoryRoute);
app.use(`${mainPath}/subCategories`,subCategoryRoute);

// @desc: Error handler middleware for handling all unhandled routes
// @usage: use this middleware at the end of all routes
// @note: this middleware should be placed after all routes
app.all('*',(req,res,next) => {
    next(new requestError(`Can't find ${req.originalUrl} on this server`, 404))
});

// use error handler middleware for handling errors inside express
app.use(errorHandler);


// assign port
const port = process.env.PORT || 8000;

// listen to port
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// handling errors outside express

// Event: unhandledRejection
// Desc: This event is emitted when a Promise is rejected and no error handler is attached to the promise within a turn of the event loop.

process.on('unhandledRejection', (err) => {
    // close server ,then exit process
    server.close(() => {
        console.log('UNHANDLED REJECTION! Shutting down...');
        console.log(`Error: ${err.name}, Message: ${err.message} \nStack: ${err.stack}`);
        process.exit(1);
    });
});

// Event: uncaughtException
// Desc: This event is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.

process.on('uncaughtException', (err) => {
    // close server ,then exit process
    server.close(() => {
        console.log('UNCAUGHT EXCEPTION! Shutting down...');
        console.log(`Error: ${err.name}, Message: ${err.message} \nStack: ${err.stack}`);
        process.exit(1);
    });
});