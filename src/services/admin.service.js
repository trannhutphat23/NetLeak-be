const userModel = require('../models/user.model');
const paymentModel = require('../models/payment.model');
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

    static getRevenue = async () => {
        try {
            const payments = await paymentModel.find({}).lean()

            const totalSum = payments.reduce((acc, currentValue) => {
                return acc + currentValue.total;
            }, 0);

            const monthlyTotals = payments.reduce((acc, item) => {
                const date = new Date(item.date);
                const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
                acc[monthYear] = (acc[monthYear] || 0) + item.total;
                return acc;
            }, {});

            const yearlyTotals = payments.reduce((acc, item) => {
                const date = new Date(item.date);
                const year = date.getFullYear();
                acc[year] = (acc[year] || 0) + item.total;
                return acc;
            }, {});

            return {
                monthlyTotals: monthlyTotals,
                yearlyTotals: yearlyTotals,
                totalRevenue: totalSum,
                payments: _.map(payments, obj => getData({ 
                    fields: ["_id", "email", "package_id", "method", "total", "date", "expired"], 
                    object: obj }))
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            } 
        }
    }
}

module.exports = UserService;