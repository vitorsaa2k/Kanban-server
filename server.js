require('dotenv').config()
require('./config/db')
const express = require('express')
const app = express()
const cors = require('cors')
const userRouter = require('./Routes/User')
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(express.json())
app.use(cors())
app.use('/', userRouter)
app.listen(process.env.PORT, () => {
  console.log(`server on port ${process.env.PORT}`)
})