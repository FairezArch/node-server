const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { tokenSecret, refreshToken } = require('../../config/app')

const MUST_SECURE = false; // Set true if running on https

const register = async (req, res) => {
  const { user, password, roles } = req.body

  if (!user || !password) return res.status(422).json({
    'message': "Username and password are required"
  })

  // Check duplicate user
  const duplicate = await User.findOne({ username: user }).exec()
  if (duplicate) return res.status(400).json({
    'message': "Username already exits"
  })

  try {
    // encrypt password
    const encryptPass = await bcrypt.hash(password, 10)

    //store new user
    await User.create({ username: user, password: encryptPass, roles })

    res.status(200).json({
      'message': `New user ${user} has been created`
    })
  } catch (error) {
    res.status(500).json({
      'message': error.message
    })
  }
}

const login = async (req, res) => {
  const { user, password } = req.body

  if (!user || !password) return res.status(422).json({
    'message': "Username and password are required"
  })


  try {
    const findUser = await User.findOne({ username: user }).exec()
    if (!findUser) return res.sendStatus(401) //unAuth

    $match = await bcrypt.compare(password, findUser.password)
    if ($match) {
      const roles = Object.values(findUser.roles)
      //create jwt
      const accessToken = jwt.sign(
        {
          "user": { "username": findUser.username, "roles": roles }
        },
        tokenSecret,
        { expiresIn: '1d' }
      )

      const newToken = jwt.sign(
        { "username": findUser.username },
        refreshToken,
        { expiresIn: '2d' }
      )

      findUser.newToken = newToken
      await findUser.save()

      res.cookie('jwt', newToken, { httpOnly: true, sameSite: 'None', secure: MUST_SECURE, maxAge: 24 * 60 * 60 * 1000 })
      res.json({
        accessToken
      })
    } else {
      res.sendStatus(401)
    }
  } catch (error) {
    res.status(500).json({
      'message': error.message
    })
  }

}

const logout = async (req, res) => {
  // on client also delete the accesstoken
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)

  const tokenCookie = cookies.jwt
  const findUser = await User.findOne({ newToken: tokenCookie }).exec()
  if (!findUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: MUST_SECURE })
    return res.sendStatus(204)
  }

  findUser.newToken = ''
  await findUser.save()

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: MUST_SECURE })
  res.sendStatus(204)

}

module.exports = { register, login, logout }
