const mongoose = require('mongoose')

const EmployeeShcema = mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Employee', EmployeeShcema)
