const StudioService = require('../services/studio.service')

class StudioController {
    addStudio = async (req, res, next) => {
        try {
            return res.status(201).json(await StudioService.addStudio(req.file.path, req.body))
        } catch (error){
            next(error)
        }
    }

    getStudios = async (req, res, next) => {
        try {
            return res.status(201).json(await StudioService.getStudios(req.body))
        } catch (error){
            next(error)
        }
    }

    getStudio = async (req, res, next) => {
        try {
            return res.status(201).json(await StudioService.getStudio(req.params))
        } catch (error){
            next(error)
        }
    }

    deleteStudio = async (req, res, next) => {
        try {
            return res.status(201).json(await StudioService.deleteStudio(req.query))
        } catch (error){
            next(error)
        }
    }
}

module.exports = new StudioController();
