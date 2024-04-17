const userModel = require('../models/user.model');
const getData = require('../utils/formatRes');
const _ = require('lodash')

class UserService {
    // [GET]/v1/api/admin/users
    static listAllUsers = async () => {
        try {
            const Users = await userModel.find({}).lean();

            return _.map(Users, obj => getData({ 
                            fields: ["_id", "email", "name", "sexuality", "phone", "favorites", "roles"], 
                            object: obj }))
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
            const user = await userModel.findById(ID);
            return getData({
                fields: ["_id", "email", "name", "sexuality", "phone", "favorites", "roles"], 
                object: user });
        } catch (error) {
            return {
                success: false,
                message: error.message
            } 
        }
    }
}

module.exports = UserService;