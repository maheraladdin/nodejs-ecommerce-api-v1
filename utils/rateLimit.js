const rateLimit = require("express-rate-limit");



class limiter {
    constructor(min,max,message) {
        const windowTime = min || 15;
        const maximumRequests = max || 5;
        const limiterMessage = message || 'Too many requests created from this IP, please try again after 15 minutes';
        return rateLimit({
            windowMs: windowTime * 60 * 1000, // 15 minutes
            max: maximumRequests, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            message: limiterMessage,
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        })
    }
}

module.exports = limiter;