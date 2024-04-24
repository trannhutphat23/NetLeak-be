const VideoService = require("../services/video.service")

class VideoController {
    addVideo = async (req, res, next) => {
        try {
            console.log(req.body)
            return res.status(201).json(await VideoService.addVideo(req.body))
        } catch (error){
            next(error)
        }
    }

}

module.exports = new VideoController()