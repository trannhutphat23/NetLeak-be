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

    getUser = async (req, res, next) => {
        try {
            return res.status(201).json(await AdminService.getUser(req.params))
        } catch (error){
            next(error)
        }
    }

    getRevenue = async (req, res, next) => {
        try {
            return res.status(201).json(await AdminService.getRevenue())
        } catch (error){
            next(error)
        }
    }
}

module.exports = new AdminController();