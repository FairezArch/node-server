const dotenv = require('dotenv').config()
const path = require('path')

module.exports = {
    port: process.env.PORT,
    tokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
    dbURI: process.env.DB_HOST,
}
