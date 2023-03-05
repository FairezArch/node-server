const Employee = require('../Models/Employee')

const index = async (req, res) => {
  const lists = await Employee.find()
  if (!lists) return res.status(204).json({ 'meessage': 'No Employee found' })
  res.json({ "data": lists })
}

const store = async (req, res) => {

  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res.status(422).json({
      'message': "First name and last name are required"
    })
  }
  try {
    const { firstname, lastname } = req.body
    await Employee.create({ firstname, lastname })

    res.status(201).json({
      "data": []
    })
  } catch (error) {
    res.status(500).json({
      "message": error
    })
  }
}

const edit = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({
      'message': "Params not found"
    })
  }
  const { id } = req.params
  const employee = await Employee.findOne({ _id: id }).exec()
  if (!employee) {
    return res.status(400).json({
      'message': `Employee not found`
    })
  }
  res.json({
    "data": employee
  })
}

const update = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({
      'message': "Employee not found"
    })
  }
  const { id } = req.params
  const { firstname = '', lastname = '' } = req.body

  const employee = await Employee.findOne({ _id: id }).exec()

  if (!employee) {
    return res.status(204).json({
      'message': `Employee not found`
    })
  }

  try {
    employee.firstname = firstname
    employee.lastname = lastname
    await employee.save()

    res.json({
      data: []
    })
  } catch (error) {
    res.status(500).json({
      "message": error
    })
  }

}

const destroy = async (req, res) => {

  if (!req?.params?.id) {
    return res.status(400).json({
      'message': "Employee not found"
    })
  }

  const { id } = req.params
  const employee = await Employee.findOne({ _id: id }).exec()
  if (!employee) {
    return res.status(400).json({
      'message': `Employee not found`
    })
  }

  try {
    await employee.deleteOne({ _id: id })
    res.status(204).json({
      data: []
    })
  } catch (error) {
    res.status(500).json({
      "message": error
    })
  }
}

module.exports = { index, store, edit, update, destroy }
