const { Router } = require('express')
const User = require('../models/user.js')

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello User!')
})

// update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { userId, password } = req.body
    if (userId === id || req.body.isAdmin) {
      const user = new User()
      if (password) {
        req.body.password = await user.encryptPassword(password)
      }

      await User.findByIdAndUpdate(id, { $set: req.body })
      res.status(200).json('Account has been updated')
    } else {
      res.status(403).json({ error: 'You can update only your account!' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    if (userId === id || req.body.isAdmin) {
      await User.findByIdAndDelete(id)
      res.status(200).json('Account has been deleted')
    } else {
      res.status(403).json({ error: 'You can delete only your account!' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// get a user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// follow a user

// unfollow a user

module.exports = router
