const userModel = require('../models/user.model');

class UserService {
    // [GET]/v1/api/user/listAllUsers
    static listAllUsers = async () => {
        try {
            const Users = await userModel.find({}).lean();
            const ModifiedUsers = Users.map(obj => {
                const {createdAt, updatedAt, __v, password,...rest} = obj
                return rest;
            })

            return ModifiedUsers;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserService;