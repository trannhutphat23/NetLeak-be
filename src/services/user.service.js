const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const getData = require('../utils/formatRes');

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
    // [PATCH]/v1/api/user/updatePassword
    static updatePassword = async ({id, password}) => {
        try {
            const existUser = await userModel.findById(id);
            if (!existUser) {
                return {
                    message: "User not registered"
                }
            }
    
            const salt = await bcrypt.genSalt()
            const newPasswordHash = await bcrypt.hash(password, salt)

            await userModel.updateOne({_id: id}, {
                $set: {password: newPasswordHash}
            })

            return {
                message: "update password successfully",
                user: getData({fields: ['_id', 'email', 'favorites', 'roles'], object: existUser})
            }
        } catch (error) {
            console.log(error)
        }
    }  
    
    static updateAccount = async ({id}, {name, sexuality, phone}) => {
        try {
            if (id.length > 24){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }
            const existUser = await userModel.findById(id).lean()
            if (!existUser){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }
            const data = {
                name: name,
                sexuality: sexuality,
                phone: phone
            }

            const updatedUser = await userModel.findByIdAndUpdate(existUser._id, data, {new: true})

            return {
                success: true,
                message: "Update successfully",
                user: getData({fields: ['_id', 'email', 'name', 'sexuality', 'phone', 'favorites', 'roles'] , object: updatedUser})
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = UserService;