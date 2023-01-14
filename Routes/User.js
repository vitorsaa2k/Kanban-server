require('dotenv').config()
const Router = require('express').Router()
const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


Router.post('/signin', async (req, res) => {

  const user = req.body

  const newUser = new User(user)
  await newUser.save()
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json(accessToken)

})

Router.get('/kanban', authenticateToken, async (req, res) => {
  const user = await User.find({name: req.user.name})
  res.json(user)
  
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token === null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return console.log(`${err} ${req.body.token}`)
    req.user = user
    next()
  })
}


module.exports = Router