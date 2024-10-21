// Desc: This file is the entry point of the application
// require third party modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const hpp = require('hpp');
const expressMongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// require middlewares
const errorHandler = require('./middlewares/errorHandlerMW');
const RequestError = require("./utils/requestError");

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

// use third party middlewares

app.use(require("./config/sessionConfig"));

// use helmet middleware for setting http headers for security
app.use(require("helmet")());

// use cors middleware for enabling cors requests
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// stripe webhook
const {webhookCheckout} = require("./controllers/orderController");
app.post("/webhook-checkout",express.raw({type: 'application/json'}), webhookCheckout)

// use express.json() to parse json data from request body
app.use(express.json({
    limit: '20kb'
}));

// hpp middleware for preventing http parameter pollution by choosing the last parameter
app.use(hpp({
    whitelist: ["price","ratingsAverage", "ratingsQuantity","sold", "quantity"],
}));

// express-mongo-sanitize middleware for preventing nosql query injection
app.use(expressMongoSanitize({allowDots: true}));

// xss-clean middleware for preventing xss attacks
app.use(xss());

// mount routes
require('./routes/mountRoutes')(app);

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
 * @param {string} err.name - error name
 * @param {string} err.message - error message
 * @param {string} err.stack - error stack
 */
const exitHandler = (msg, err) => {
    // close server ,then exit process
    server.close(() => {
        console.log(msg);
        console.log(`Error: ${err.name}, Message: ${err.message} \nStack: ${err.stack}`);
        process.exit(1);
    });
}

/*
 * @desc: This event is emitted when a Promise is rejected and no error handler is attached to the promise within a turn of the event loop.
 * @event: unhandledRejection
 */
process.on('unhandledRejection', (err) => exitHandler('UNHANDLED REJECTION! Shutting down...', err));

/*
 * @desc: This event is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.
 * @event: uncaughtException
 */
process.on('uncaughtException', (err) => exitHandler('UNCAUGHT EXCEPTION! Shutting down...', err));

