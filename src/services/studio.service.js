const studioModel = require("../models/studio.model");

class StudioService {
    static addStudio = async ({name}) => {
        try {
            const existStudio = await studioModel.findOne({name}).lean()

            if (existStudio) {
                return {
                    success: false,
                    message: "Studio already exists"
                }
            }

            const newStudio = new studioModel({name})

            return await newStudio.save()
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getStudios = async () => {
        try {
            const studios = await studioModel.find({}).lean()

            return studios

        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getStudio = async ({id}) => {
        try {
            const studio = await studioModel.findById(id).lean()
            if (!studio){
                return {
                    success: false,
                    message: "Studio does not exist"
                }
            }
            return studio;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteStudio = async ({id}) => {
        try {
            const studio = await studioModel.findByIdAndDelete(id)
            if (!studio){
                return {
                    success: false,
                    message: "Studio does not exist"
                }
            }
            return {
                success: true,
                message: "Delete successfully"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = StudioService;
