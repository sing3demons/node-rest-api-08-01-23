const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const connectDB = require('./db')
const usersRoute = require('./routes/users')
const authRoute = require('./routes/auth')

const app = express()
dotenv.config({ path: '.env.dev' })
const port = process.env.PORT || 3000
connectDB()

// Middleware
app.use(helmet())
app.use(morgan('common'))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.listen(port, () => console.log(`Server is running on port ${port}`))
