require('dotenv').config()
const Router = require('express').Router()
const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const generateId = () => {
  return Math.random().toString(16).slice(2)
}

let user = [
  {
    title: 'To do',
    color: '#0080FE',
    tasks: [
      {
        task: 'Center the div',
        isCritical: true,
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
]

function updateToDos(data) {
  let [destination] = user.filter((user) => user.title === data.destination.droppableId)
  let destinationIndex = user.indexOf(destination)
  let [source] = user.filter((user) => user.title === data.source.droppableId)
  let sourceIndex = user.indexOf(source)

  let objectInMovement = source.tasks[data.source.index]

  user[sourceIndex].tasks.splice(data.source.index, 1)
  user[destinationIndex].tasks.splice(data.destination.index, 0, objectInMovement)
  
  return user
}

Router.post('/kanban/newMarker', async(req, res) => {
  const newMarker = req.body
  user.push({
    ...newMarker,
    tasks: []
  })
  res.json({
    status: 'SUCCESS',
    user
  })
})

Router.post('/kanban/newTask', async(req, res) => {
  const {title, isCritical, task} = req.body

  const [destination] = user.filter(marker => (
    marker.title === title
  ))

  const destinationIndex = user.indexOf(destination)
  user[destinationIndex].tasks.push({task, isCritical, isDone: false, id: generateId()})
  res.json(destination)
})


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