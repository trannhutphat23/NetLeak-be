const PaymentPackageModel = require('../models/payment_package.model')
const getData = require('../utils/formatRes')
const _ = require('lodash');

class PaymentService {
    static addPayment = async ({title, cost, description}) => {
        try {
            const existPaymentPackage = await PaymentPackageModel.findOne({title})
            if (existPaymentPackage) {
                return {
                    success: false,
                    message: "Payment package already exists"
                }
            }
            const newPaymentPackage = new PaymentPackageModel({
                title,
                cost,
                description
            })
            const formatNewPaymentPackage = await newPaymentPackage.save()

            return getData({ fields: ["_id", "title", "cost", "description"], object: formatNewPaymentPackage})
        } catch (error) {
            return {
                success: false,
                message: error.message
            } 
        }
    }

    static updatePayment = async ({id}, {title, cost, description}) => {
        try {
            const existPaymentPackage = await PaymentPackageModel.findById(id)
            if (!existPaymentPackage){
                return {
                    success: false,
                    message: "Payment package does not exist"
                }
            }

            const data = {
                title,
                cost,
                description
            }

            const updatePaymentPackage = await PaymentPackageModel.findByIdAndUpdate(id, data, {new: true})

            return {
                success: true,
                message: "Update successfully",
                package:getData({ fields: ["_id", "title", "cost", "description"], object: updatePaymentPackage})
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static listPayments = async () => {
        try {
            const paymentPackages = await PaymentPackageModel.find().lean()

            return _.map(paymentPackages, obj => getData({ 
                fields: ["_id", "title", "cost", "description"], 
                object: obj }));
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getPayment = async ({id}) => {
        try {
            const existPaymentPackage = await PaymentPackageModel.findById(id);
            if (!existPaymentPackage) {
                return {
                    success: false,
                    message: "Payment package does not exist"
                }
            }

            return getData({ fields: ["_id", "title", "cost", "description"], object: existPaymentPackage})
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deletePayment = async ({id}) => {
        try {
            const existPaymentPackage = await PaymentPackageModel.findById(id)
            if (!existPaymentPackage){
                return {
                    success: false,
                    message: "Payment package does not exist"
                }
            }

            await PaymentPackageModel.findByIdAndDelete(id)

            return {
                success: true,
                message: "Delete successfully"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            } 
        }
    }
}

module.exports = PaymentService;