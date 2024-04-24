const videoModel = require('../models/video.model')
const getData = require('../utils/formatRes');

class VideoService {
    // [POST] add video of film
    static addVideo = async ({ filmId, videoLink, chapter }) => {
        try {
            const video = await videoModel.findOne({ filmId: filmId })

            if(!video){
                console.log(filmId, videoLink, chapter)
                // const newVideo = new videoModel({
                //     filmId, 
                //     videoLink, 
                //     chapter: parseInt(chapter)
                // })

                // const savedVideo = await newVideo.save()

                return {
                    success: true,
                    message: "Video has been added to the list",
                    savedVideo
                }
            }
            else{
                if (video.videoLink.some(vidLink => vidLink == video)) {
                    return {
                        success: false,
                        message: "video already added to Film",
                    }
                }
                else {
                    console.log(video.videoLink)
                    
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