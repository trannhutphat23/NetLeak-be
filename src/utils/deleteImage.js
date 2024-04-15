const cloudinary = require("../configs/config.cloudinary");

const deleteImage = async (fileID) => {
    try {
        const result = await cloudinary.uploader.destroy(fileID);
        return {
            message: "Success",
            result,
        };
    } catch (error) {
        return {
            message: "Failure",
            error,
        };
    }
    
    // cloudinary.uploader.destroy(fileID)
    //                     .then((result) => {
    //                         console.log(result);
    //                         return{
    //                             message: "Success",
    //                             result,
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         return {
    //                             message: "Failure",
    //                             error,
    //                         }
    //                     });
}

module.exports = deleteImage;