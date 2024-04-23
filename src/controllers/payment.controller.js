const PaymentService = require('../services/payment.service')

class PaymentController {
    addPayment = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.addPayment(req.body))
        } catch (error){
            next(error)
        }
    }

    updatePayment = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.updatePayment(req.params, req.body))
        } catch (error){
            next(error)
        }
    }

    listPayments = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.listPayments())
        } catch (error){
            next(error)
        }
    }

    getPayment = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.getPayment(req.params))
        } catch (error){
            next(error)
        }
    }

    deletePayment = async (req, res, next) => {
        try {
            return res.status(201).json(await PaymentService.deletePayment(req.params))
        } catch (error){
            next(error)
        }
    }
}

module.exports = new PaymentController()