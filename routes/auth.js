const { Router } = require('express')

const router = Router()
const User = require('../models/user')

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

module.exports = router
