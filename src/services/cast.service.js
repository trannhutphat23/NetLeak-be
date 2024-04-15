const castModel = require('../models/cast.model');
const CastModel = require('../models/cast.model')
const uploadImage = require('../utils/uploadImage')

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
}

module.exports = CastService;