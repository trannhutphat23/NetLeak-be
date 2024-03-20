const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const getData = require('../utils/index');

class UserService {
    // [GET]/v1/api/admin/listAllUsers
    static listAllUsers = async () => {
        try {
            const Users = await userModel.find({}).lean();
            var id = 1;
            const ModifiedUsers = Users.map(obj => {
                const {_id, createdAt, updatedAt, __v, roles,...rest} = obj
                return {
                    id: id++, 
                    email: rest.email,
                    name: rest.name,
                    age: rest.age,
                    gender: rest.gender,
                    phone: rest.phone
                };
            })

            return ModifiedUsers;
        } catch (error) {
            console.log(error);
        }
    } 
}

module.exports = UserService;