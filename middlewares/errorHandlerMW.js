// @desc: Error handler middleware
// @usage: use this middleware at the end of all routes

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'; // 400 or 500
    process.env.NODE_ENV === 'development' ? sendErrorDev(err, res) : sendErrorProd(err, res);
}

const sendErrorDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.log('ERROR', err);
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

