const CastService = require("../services/cast.service");

class CastController {
    addCast = async (req, res, next) => {
        try {
            return res.status(201).json(await CastService.addCast(req.file.path, req.body));
        }
        catch (error) {
            next(error);
        }
    }

    getCasts = async (req, res, next) => {
        try {
            return res.status(201).json(await CastService.getCasts());
        }
        catch (error) {
            next(error);
        }
    }

}

module.exports = new CastController();