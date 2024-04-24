const VideoService = require("../services/video.service")

class VideoController {
    addVideo = async (req, res, next) => {
        try {
            return res.status(201).json(await VideoService.addVideo(req.body))
        } catch (error){
            next(error)
        }
    }

}

module.exports = new VideoController()