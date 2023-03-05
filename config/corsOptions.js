// Cross Origin Resource Sharing

const whitelist = require('./allowedOrigin')

const corsOptions = {
    origin: (origin, callback) => {
        (whitelist.indexOf(origin) !== -1 || !origin) ? callback(null, true): callback(new Error('Not allowed by CORS'))
    },
    optionsSuccessStatus: 200
}


module.exports = corsOptions
