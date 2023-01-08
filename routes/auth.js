const { Router } = require('express')
const router = Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const generateJWT = user => {
  const accessToken = jwt.sign(
    {
      sub: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  )

  const refreshToken = jwt.sign(
    {
      sub: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '1d',
    }
  )
  return { accessToken, refreshToken }
}

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body
    let user = new User()
    user.username = username
    user.password = await user.encryptPassword(password)
    user.email = email

    await user.save()

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    !user && res.status(404).json({ error: 'User not found' })

    const isValid = await user.checkPassword(password)
    !isValid && res.status(400).json({ error: 'Invalid credentials' })

    const token = generateJWT(user)
    res.status(200).json(token)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})



const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers['authorization']) return res.sendStatus(401)

    const token = req.headers['authorization'].replace('Bearer ', '')

    const { sub } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const tokenDt = { userId: sub }

    req.tokenDt = tokenDt
    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(403)
  }
}

router.get('/profile', jwtValidate, async (req, res) => {
  const { userId } = req.tokenDt
  const user = await User.findById(userId)
  res.json(user)
})

const jwtRefreshTokenVerify = (req, res, next) => {
  try {
    if (!req.headers['authorization']) return res.sendStatus(401)
    const token = req.headers['authorization'].replace('Bearer ', '')

    const { sub } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    const refreshToken = { userId: sub }
    req.refreshToken = refreshToken

    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

router.post('/refresh-token', jwtRefreshTokenVerify, async (req, res) => {
  const { userId } = req.refreshToken
  const user = await User.findById(userId)

  if (!user) return res.sendStatus(401)

  const { accessToken, refreshToken } = generateJWT(user)

  return res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
})


module.exports = router
