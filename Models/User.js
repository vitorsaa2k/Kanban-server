const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  board: {type: Array, default: [
    {
      name: 'To do',
      tasks: [{}]
    },
    {
      name: 'Doing',
      tasks: [{}]
    },
    {
      name: 'Done',
      tasks: [{}]
    },
  ],
  },
})

const user = mongoose.model('User', userSchema)

module.exports = user