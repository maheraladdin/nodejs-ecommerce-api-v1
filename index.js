// Desc: This file is the entry point of the application
// require third party modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// require custom modules
// require routes
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');

// require middlewares
const errorHandler = require('./middlewares/errorHandlerMW');
const RequestError = require("./utils/RequestError");

// load env variables from config.env
dotenv.config({ path: './config.env' });

// connect to database
require('./config/monogodb_connection')();

// initialize express app
const app = express();

// use middlewares

// use morgan for logging requests in development mode
process.env.NODE_ENV === "development" && app.use(morgan('dev')) && console.log('Morgan enabled for development');

// use express middlewares

// use express.json() to parse json data from request body
app.use(express.json());
// use express.urlencoded() to parse urlencoded data from request body
app.use(express.urlencoded({ extended: true }));
// use express.static() to serve static files
app.use(express.static('uploads'));

// mainPath
const mainPath = "/api/v1.0.0";

// Mount routes
app.use(`${mainPath}/categories`,categoryRoute);
app.use(`${mainPath}/subCategories`,subCategoryRoute);
app.use(`${mainPath}/brands`,brandRoute);
app.use(`${mainPath}/products`,productRoute);

// Error handler middleware for handling all unhandled routes
app.all('*',(req,res,next) => {
    next(new RequestError(`Can't find ${req.originalUrl} on this server`, 404))
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

/**
 * @desc: This function is used to handle unhandled promise rejections and uncaught exceptions
 * @param {string} msg - message to be displayed
 * @param {Error} err - error object
 */
const exitHandler = (msg, err) => {
    // close server ,then exit process
    server.close(() => {
        console.log(msg);
        console.log(`Error: ${err.name}, Message: ${err.message} \nStack: ${err.stack}`);
        process.exit(1);
    });
}

/**
 * @desc: This event is emitted when a Promise is rejected and no error handler is attached to the promise within a turn of the event loop.
 * @event: unhandledRejection
 */
process.on('unhandledRejection', (err) => exitHandler('UNHANDLED REJECTION! Shutting down...', err));

/**
 * @desc: This event is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.
 * @event: uncaughtException
 */
process.on('uncaughtException', (err) => exitHandler('UNCAUGHT EXCEPTION! Shutting down...', err));