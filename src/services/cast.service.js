const castModel = require('../models/cast.model');
const CastModel = require('../models/cast.model')
const uploadImage = require('../utils/uploadImage')
const deleteImage = require('../utils/deleteImage')

class CastService {
    static addCast = async (filePath, body) => {
        try {
            const cloudinaryFolder = 'NetLeak/Cast_avatar';
            const avatarUrl = await uploadImage(filePath, cloudinaryFolder);
            const newCast = new CastModel({
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
            const Casts = await castModel.find({}).lean();

            return Casts;
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
            
            return castModel.findById(ID)  
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
            
            const linkArr = imgUrl.split('/')
            const imgName = linkArr[linkArr.length - 1]
            const imgID = imgName.split('.')[0]
            const result = "NetLeak/Cast_Avatar/" + imgID
            await deleteImage(result)

            await castModel.findByIdAndDelete(ID)
            
            return {
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