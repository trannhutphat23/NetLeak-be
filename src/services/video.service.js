const movieModel = require('../models/movie.model')
const videoModel = require('../models/video.model')
const getData = require('../utils/formatRes');

class VideoService {
    // [POST] add video of film
    static addVideo = async ({ filmId, videoLink, chapter = 0 }) => {
        try {
            const video = await videoModel.findOne({ filmId: filmId })
            const film = await movieModel.findById(filmId)

            if (!film){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            if (film.type == 'series') {
                if (chapter == 0) {
                    return {
                        success: false,
                        message: "Film with type series must have chapter",
                    }
                }
            }
            else {
                if (chapter != 0) {
                    return {
                        success: false,
                        message: "Film with type movie don't have chapter",
                    }
                }
            }

            if (!video) {
                const newVideo = new videoModel({
                    filmId,
                    videoList: {
                        videoLink,
                        chapter: parseInt(chapter)
                    }
                })

                const savedVideo = await newVideo.save()

                return {
                    success: true,
                    message: "Video has been added",
                    savedVideo
                }
            }
            else {
                if (video.videoList.some(vid => vid.chapter == chapter)) {
                    return {
                        success: false,
                        message: "Chapter are duplicated",
                    }
                }
                else {
                    const videoChapter = {
                        videoLink,
                        chapter: parseInt(chapter)
                    }

                    video.videoList.push(videoChapter)
                    const savedVideo = await video.save()

                    return {
                        success: true,
                        message: "Video has been added",
                        savedVideo
                    }
                }

            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static deleteVideo = async ({ filmId, videoListId }) => {
        try {
            const video = await videoModel.findOne({ filmId: filmId })
            const film = await movieModel.findById(filmId)

            if (!film){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            let deletedVideo = null
            video.videoList.forEach(async (vid, index) => {
                if (vid._id.toString() == videoListId) {
                    video.videoList.splice(index, 1)
                    deletedVideo = vid
                }
            })
            await video.save()

            if (deletedVideo) {

                return {
                    success: true,
                    message: "Video has been deleted",
                    deletedVideo
                }
            }
            else {

                return {
                    success: false,
                    message: "Video not found",
                }

            }

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static getVideo = async ({ filmId }) => {
        try {
            const video = await videoModel.findOne({ filmId: filmId })
            
            let videoList = []

            if(video){
                videoList = video.videoList
            }

            if (video) {
                return videoList
            }
            else {
                return {
                    success: false,
                    message: "Can not find film",
                }

            }

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }
}
module.exports = VideoService;