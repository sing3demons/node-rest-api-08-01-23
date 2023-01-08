const { Router } = require('express')

const router = Router()
const User = require('../models/user')

router.get('/register', async (req, res) => {
  try {
    const user = new User({
      username: 'sing3demons',
      password: '123456',
      email: 'sing@dev.com',
    })
    await user.save()
    res.send(user)
  } catch (error) {
      res.status(500).json({ error: error.message })
  }
})

module.exports = router
