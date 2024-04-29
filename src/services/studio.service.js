const studioModel = require("../models/studio.model");
const uploadImage = require('../utils/uploadImage')
const deleteImage = require('../utils/deleteImage')
const getName = require('../utils/getNameImage')
const getData = require('../utils/formatRes');
const _ = require('lodash');

class StudioService {
    static addStudio = async (filePath, body) => {
        try {
            const cloudinaryFolder = 'NetLeak/Studio_Avatar';
            const avatarUrl = await uploadImage(filePath, cloudinaryFolder);
            const existStudio = await studioModel.findOne({name: body.name}).lean()

            if (existStudio) {
                return {
                    success: false,
                    message: "Studio already exists"
                }
            }

            const newStudio = new studioModel({
                avatar: avatarUrl,
                name: body.name,
            })

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
                fields: ["_id", "avatar", "name", "movies"], 
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
                fields: ["_id", "avatar", "name", "movies"], 
                object: studio });
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteStudio = async (query) => {
        try {
            const ID = query.id;
            const imgUrl = query.imageUrl
            
            const studio = await studioModel.findById(ID)
            if (!studio){
                return {
                    success: false,
                    message: "Studio does not exist"
                }
            }

            if (imgUrl === studio.avatar){
                const name = getName(imgUrl)
                const result = "NetLeak/Studio_Avatar/" + name
                await deleteImage(result)
            }else{
                return {
                    success: false,
                    message: "Studio avatar does not match this studio"
                }
            }
            await studioModel.findByIdAndDelete(ID)
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
