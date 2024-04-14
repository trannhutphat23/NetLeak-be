const AdminService = require('../services/admin.service')

class AdminController {

    // list all users
    listAllUsers = async (req, res, next) => {
        try {
            return res.status(201).json(await AdminService.listAllUsers())
        } catch (error){
            next(error)
        }
    }
}

module.exports = new AdminController();