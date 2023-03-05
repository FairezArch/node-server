const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const { tokenSecret, refreshToken } = require('../../config/app')

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)

  const tokenCookie = cookies.jwt
  const findUser = await User.findOne({newToken: tokenCookie}).exec()
  if (!findUser) return res.sendStatus(403)

  //evaluate jwt
  jwt.verify(tokenCookie, refreshToken, (err, decoded) => {
    if (err || findUser.username !== decoded.username) return res.sendStatus(403); //Invalid Token
    const roles = Object.values(findUser.roles)

    const accessToken = jwt.sign(
      {
        "user": { "username": findUser.username, "roles": roles }
      },
      tokenSecret,
      { expiresIn: '30s' }
    )
    res.json({ accessToken })
  });
}

module.exports = { handleRefreshToken }
