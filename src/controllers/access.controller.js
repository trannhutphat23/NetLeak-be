const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::`, req.body)
            return res.status(201).json(await AccessService.signup(req.body))
        } catch (error){
            next(error)
        }
    }

    login = async (req, res, next) => {
        try {
            console.log(`[P]::login::`,req.body)
            return res.status(201).json(await AccessService.login(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccessController()