const { Router } = require('express')
const User = require('../models/user.js')

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello User!')
})

// update user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    res.status(200).json(user)
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
    const { password, updatedAt, ...other } = user._doc
    res.status(200).json(other)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// follow a user
router.put('/:id/follow', async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } })
        await currentUser.updateOne({ $push: { followings: req.params.id } })
        res.status(200).json('user has been followed')
      } else {
        res.status(403).json('you allready follow this user')
      }
    } else {
      res.status(403).json('you cant follow yourself')
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// unFollow a user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { followings: req.params.id } })
        res.status(200).json('user has been unfollowed')
      } else {
        res.status(403).json('you dont follow this user')
      }
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json('you cant unfollow yourself')
  }
})

module.exports = router
