const { logEvents } = require('./logEvents.js')

const errorHandler = function(err, req, res, next) {
    logEvents(`${err.name}: ${err.message}`, 'errlog.txt')
    console.error(err.stack)
    res.status(500).send(err.message)
}

module.exports = errorHandler
