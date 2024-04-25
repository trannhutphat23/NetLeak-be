const PaymentService = require('../services/payment.service')

class PaymentController {
    addPayment = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.addPaymentPackage(req.body))
        } catch (error){
            next(error)
        }
    }

    updatePayment = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.updatePaymentPackage(req.params, req.body))
        } catch (error){
            next(error)
        }
    }

    listPayments = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.listPaymentPackage())
        } catch (error){
            next(error)
        }
    }

    getPayment = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.getPaymentPackage(req.params))
        } catch (error){
            next(error)
        }
    }

    deletePayment = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.deletePaymentPackage(req.params))
        } catch (error){
            next(error)
        }
    }
}

module.exports = new PaymentController()