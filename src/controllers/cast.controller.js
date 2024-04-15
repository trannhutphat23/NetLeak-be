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

    getCast = async (req, res, next) => {
        try {
            return res.status(201).json(await CastService.getCast(req.params));
        }
        catch (error) {
            next(error);
        }
    }

    deleteCast = async (req, res, next) => {
        try {
            return res.status(201).json(await CastService.deleteCast(req.query));
        }
        catch (error) {
            next(error);
        }
    }

}

module.exports = new CastController();