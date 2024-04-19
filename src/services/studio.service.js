const studioModel = require("../models/studio.model");
const getData = require('../utils/formatRes');
const _ = require('lodash');

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
            const studios = await studioModel.find({}).populate({
                path: "movies",
                select: '_id plot title fullplot released lastupdated type'
            }).lean()

            return _.map(studios, obj => getData({ 
                fields: ["_id", "name", "movies"], 
                object: obj }))

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
            return getData({ 
                fields: ["_id", "name", "movies"], 
                object: studio });
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
