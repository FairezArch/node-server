const express = require('express')
const router = express.Router()
const EmployeeController = require('../../app/Controllers/EmployeeController')
const ROLES_LIST = require('../../config/roleList')
const verifyRole = require('../../middleware/verifyRoles')

router.route('/').get(EmployeeController.index)
router.post('/store', verifyRole(ROLES_LIST.Admin, ROLES_LIST.Editor), EmployeeController.store)
router.put('/:id/update', verifyRole(ROLES_LIST.Admin, ROLES_LIST.Editor), EmployeeController.update)
router.delete('/:id/delete', verifyRole(ROLES_LIST.Editor), EmployeeController.destroy)

router.route('/:id')
    .get(EmployeeController.edit)

module.exports = router
