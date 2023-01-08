const { Schema, model } = require('mongoose')
const { genSalt, hash, compare } = require('bcryptjs')

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    // role: { type: String, enum: ['member', 'admin'], default: 'member' },
    profilePicture: { type: String, default: '' },
    coverPicture: { type: String, default: '' },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

UserSchema.methods.encryptPassword = async function (password) {
  const salt = await genSalt(10)
  return await hash(password, salt)
}

UserSchema.methods.checkPassword = async function (password) {
  return await compare(password, this.password)
}

const User = model('User', UserSchema)

module.exports = User
