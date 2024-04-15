const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const getData = require('../utils/index');

class UserService {
    // [GET]/v1/api/admin/listAllUsers
    static listAllUsers = async () => {
        try {
            const Users = await userModel.find({}).lean();
            const ModifiedUsers = Users.map(obj => {
                const {_id, createdAt, updatedAt, __v, roles,...rest} = obj
                return {
                    _id: _id,
                    email: rest.email,
                    name: rest.name,
                    sexuality: rest.sexuality,
                    phone: rest.phone,
                    favorites: rest.favorites
                };
            })

            return ModifiedUsers;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    } 

    static getUser = async (params = {id}) => {
        try {
            const ID = params.id;
            
            return userModel.findById(ID)
        } catch (error) {
            return {
                success: false,
                message: error.message
            } 
        }
    }
}

module.exports = UserService;