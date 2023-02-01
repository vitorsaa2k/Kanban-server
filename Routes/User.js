require('dotenv').config()
const Router = require('express').Router()
const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

let user = [
  {
    title: 'To do',
    color: '#0080FE',
    tasks: [
      {
        task: 'Center the div',
        isCritical: false,
        isDone: false,
        id: '3JSDDN'
      },
      {
        task: 'newArray',
        isCritical: false,
        isDone: false,
        id: 'PASIDA9'
      },
    ]
  },
  {
    title: 'Doing',
    color: '#F08538',
    tasks: [
      {
        task: 'Create a new button',
        isCritical: false,
        isDone: false,
        id: 'KLASJ3'
      }
    ]
  },
  {
    title: 'Done',
    color: '#79A41F',
    tasks: [
      {
        task: 'Change the input color',
        isCritical: false,
        isDone: false,
        id: 'ASDSA'
      }
    ]
  },
  {
    title: 'a',
    color: '',
    tasks: [
      {
        task: 'test',
        isCritical: false,
        isDone: false,
        id: 'FDG61'
      }
    ]
  },
  {
    title: 'b',
    color: '',
    tasks: [
      {
        task: 'Change the input color',
        isCritical: false,
        isDone: false,
        id: 'ASDFS7'
      },
    ]
  },
  {
    title: 'c',
    color: '',
    tasks: [
      {
        task: 'Change the input color',
        isCritical: false,
        isDone: false,
        id: 'ASFAS645'
      }
    ]
  },
]

function updateToDos(data) {
  let destination = {...user.filter((user) => user.title === data.destination.droppableId)}
  let destinationIndex = user.indexOf(destination[0])
  let source = {...user.filter((user) => user.title === data.source.droppableId)}
  let sourceIndex = user.indexOf(source[0])

  if(data.destination.droppableId === data.source.droppableId) {
    let dest = {...source[0].tasks[data.source.index]}
    let sour = {...destination[0].tasks[data.destination.index]}
    user[destinationIndex].tasks[data.destination.index] = dest
    user[sourceIndex].tasks[data.source.index] = sour

  } else {
    user[destinationIndex].tasks.splice(data.destination.index, 0, source[0].tasks[data.source.index])
    user[sourceIndex].tasks.splice(data.source.index, 1)
  }
  
  return user
}


Router.post('/signin', async (req, res) => {

  const user = req.body

  const newUser = new User(user)
  await newUser.save()
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json(accessToken)

})

Router.post('/kanban/update', async (req, res) => {
  let newBoard = updateToDos(req.body)
  res.json(newBoard)
})

Router.get('/kanban', authenticateToken, async (req, res) => {
  /* const user = await User.find({name: req.user.name}) */
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