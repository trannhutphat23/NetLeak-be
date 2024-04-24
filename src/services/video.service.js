const videoModel = require('../models/video.model')
const getData = require('../utils/formatRes');

class VideoService {
    // [POST] add video of film
    static addVideo = async ({ filmId, videoLink, chapter }) => {
        try {
            const video = await videoModel.findOne({ filmId: filmId })

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
                if (video.videoList.some(vid => vid.videoLink == videoLink)) {
                    return {
                        success: false,
                        message: "Video already added to Film",
                    }
                }
                else {
                    if (video.videoList.some(vid => vid.chapter == chapter)){
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