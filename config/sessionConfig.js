const sessions = require("client-sessions");

module.exports = sessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: process.env.SESSION_SECRET, // this should be a long un-guessable string.
    duration: 2 * 60 * 60 * 1000, // how long the session will stay valid in ms
    cookie: {
        path: "/",
        ephemeral: true, // when true, cookie expires when the browser closes
        httpOnly: false, // when true, the cookie is not accessible via front-end JavaScript
        secure: false, // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
});
