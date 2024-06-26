const castModel = require('../models/cast.model');
const uploadImage = require('../utils/uploadImage')
const deleteImage = require('../utils/deleteImage')
const getData = require('../utils/formatRes')
const getName = require('../utils/getNameImage')
const _ = require('lodash');

class CastService {
    static addCast = async (filePath, body) => {
        try {
            const cloudinaryFolder = 'NetLeak/Cast_avatar';
            const avatarUrl = await uploadImage(filePath, cloudinaryFolder);
           
            const newCast = new castModel({
                avatar: avatarUrl,
                name: body.name,
                description: body.description
            });
            return await newCast.save();
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getCasts = async () => {
        try {
            const Casts = await castModel.find({}).populate({
                path: "movies",
                select: '_id plot title fullplot released lastupdated type'
            }).lean();

            return _.map(Casts, obj => getData({ 
                fields: ["_id", "avatar", "name", "description", "movies"], 
                object: obj }));
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getCast = async (params) => {
        try {
            const ID = params.id;
            
            const cast = await castModel.findById(ID);
            if (!cast) {
                return {
                    success: false,
                    message: "Cast not exist"
                }
            }

            return getData({ 
                fields: ["_id", "avatar", "name", "description", "movies"], 
                object: cast });
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteCast = async (query) =>{
        try {
            const ID = query.id;
            const imgUrl = query.imageUrl
            
            const cast = await castModel.findById(ID)
            if (!cast){
                return {
                    success: false,
                    message: "Cast not exist"
                }
            }

            if (imgUrl === cast.avatar){
                const name = getName(imgUrl)
                const result = "NetLeak/Cast_Avatar/" + name
                await deleteImage(result)
            }else {
                return {
                    success: false,
                    message: "Cast avatar does not match this cast"
                }
            }
            await castModel.findByIdAndDelete(ID)
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

module.exports = CastService;