const userModel = require('../models/user.model');
const movieModel = require('../models/movie.model');
const savedMovieModel = require('../models/saved_movie.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const https = require('https');
const getData = require('../utils/formatRes');
const { move, use } = require('../routes/user/user.route');

class UserService {
    // [GET]/v1/api/user/listAllUsers
    static listAllUsers = async () => {
        try {
            const Users = await userModel.find({}).lean();
            const ModifiedUsers = Users.map(obj => {
                const { createdAt, updatedAt, __v, password, ...rest } = obj
                return rest;
            })

            return ModifiedUsers;
        } catch (error) {
            console.log(error);
        }
    }
    // [PATCH]/v1/api/user/updatePassword
    static updatePassword = async ({ id, password }) => {
        try {
            const existUser = await userModel.findById(id);
            if (!existUser) {
                return {
                    message: "User not registered"
                }
            }

            const salt = await bcrypt.genSalt()
            const newPasswordHash = await bcrypt.hash(password, salt)

            await userModel.updateOne({ _id: id }, {
                $set: { password: newPasswordHash }
            })

            return {
                message: "update password successfully",
                user: getData({ fields: ['_id', 'email', 'favorites', 'roles'], object: existUser })
            }
        } catch (error) {
            console.log(error)
        }

    }
    
    static updateAccount = async ({id}, {name, sexuality, phone}) => {
        try {
            if (id.length > 24){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }
            const existUser = await userModel.findById(id).lean()
            if (!existUser){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            const data = {
                name: name,
                sexuality: sexuality,
                phone: phone
            }

            const updatedUser = await userModel.findByIdAndUpdate(existUser._id, data, { new: true })

            return {
                success: true,
                message: "Update successfully",
                user: getData({ fields: ['_id', 'email', 'name', 'sexuality', 'phone', 'favorites', 'roles'], object: updatedUser })
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
    
    static saveFilm = async ({userId, filmId}) => {
        try {
            const user = await userModel.findById(userId)
            const film = await movieModel.findById(filmId)

            const existSavedFilm = await savedMovieModel.findOne({ userId: user._id })
            if (existSavedFilm) {
                const savedFilm = await savedMovieModel.findOneAndUpdate({ userId: user._id, filmId: { $nin: [film._id] } }, {
                    $push: { filmId: film._id }
                });
                if (savedFilm) {
                    const formatSavedFilm = await (await savedFilm.populate({
                        path: "filmId",
                        select: '_id plot title fullplot released lastupdated type'
                    })).
                    populate({
                        path: "userId",
                        select: '_id email name sexuality phone favorites roles'
                    })
                    return getData({ fields: ['_id', 'userId', 'filmId'], object: formatSavedFilm });
                }
                return {
                    success: false,
                    message: "Film already saved"
                }
            } else {
                const newSavedFilm = new savedMovieModel({
                    userId: user._id,
                    filmId: [film._id]
                })
                const savedFilm = await newSavedFilm.save()
                const formatSavedFilm = await (await savedFilm.populate({
                    path: "filmId",
                    select: '_id plot title fullplot released lastupdated type'
                })).
                populate({
                    path: "userId",
                    select: '_id email name sexuality phone favorites roles'
                })

                return getData({ fields: ['_id', 'userId', 'filmId'], object: formatSavedFilm })
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static unsaveFilm = async ({userId, filmId}) => {
        try {
            const user = await userModel.findById(userId)
            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            const film = await movieModel.findById(filmId)
            const existSavedFilm = await savedMovieModel.findOne({ userId: user._id, filmId: film._id })
            if(existSavedFilm){
                const unSavedFilm = await savedMovieModel.findOneAndUpdate({ userId: user._id, filmId: { $in: [film._id] } }, {
                    $pull: { filmId: film._id }
                });
                return {
                    success: true,
                    message: "Delete successfully",
                }
            }
            return {
                success: false,
                message: "Film not saved"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static addFavoriteFilm = async ({ film_id, user_id }) => {
        try {
            const movie = await movieModel.findById(film_id)
            const user = await userModel.findById(user_id)

            const checkIsSaveAlready = user.favorites.some((id) => {
                return id.toString() == movie._id.toString()
            })

            if (checkIsSaveAlready) {
                return {
                    success: false,
                    message: "Film already saved",
                }
            }
            else {
                user.favorites.push(film_id)
                await user.save()
                return {
                    success: true,
                    message: "add favorite film successfully",
                    movie: getData({
                        fields: ['_id', 'plot', 'genres', 'cast', 'image', 'title', 'fullplot', 'released',
                            'directors', 'imdb', 'type'],
                        object: movie
                    })
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteFavoriteFilm = async ({ film_id, user_id }) => {
        try {
            const movie = await movieModel.findById(film_id)
            const user = await userModel.findById(user_id)

            const checkIsSaveAlready = user.favorites.some((id) => {
                return id.toString() === movie._id.toString()
            })

            if (checkIsSaveAlready) {
                for (let i = 0; i < user.favorites.length; i++) {
                    if (user.favorites[i].toString() === movie._id.toString())
                    {
                        user.favorites.splice(i,1)
                        await user.save()
                        break
                    }
                }
                return {
                    success: true,
                    message: "Film has been deleted successfully",
                    movie: getData({
                        fields: ['_id', 'plot', 'genres', 'cast', 'image', 'title', 'fullplot', 'released',
                            'directors', 'imdb', 'type'],
                        object: movie
                    })
                }
            }
            else {
                return {
                    success: false,
                    message: "Film have not been added to favorites before",
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getFavoriteFilm = async ({ user_id }) => {
        try {
            const userInfo = await userModel.findById(user_id).populate('favorites')

            const movies = userInfo.favorites

            return movies

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static paymentByMoMo = async ({amount, payInfo, redirectUrl}) => {
        try {
            // var partnerCode = "MOMO";
            // var accessKey = "F8BBA842ECF85";
            // var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            // var requestId = partnerCode + new Date().getTime();
            // var orderId = requestId;
            // var orderInfo = payInfo;
            // var ipnUrl = "https://google.com";
            // var requestType = "captureWallet"
            // var extraData = "";

            // //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            // var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType

            // var signature = crypto.createHmac('sha256', secretkey)
            //     .update(rawSignature)
            //     .digest('hex');

            // const requestBody = JSON.stringify({
            //     partnerCode : partnerCode,
            //     accessKey : accessKey,
            //     requestId : requestId,
            //     amount : amount,
            //     orderId : orderId,
            //     orderInfo : orderInfo,
            //     redirectUrl : redirectUrl,
            //     ipnUrl : ipnUrl,
            //     extraData : extraData,
            //     requestType : requestType,
            //     signature : signature,
            //     lang: 'vi'
            // });

            // const options = {
            //     hostname: 'test-payment.momo.vn',
            //     port: 443, // https
            //     path: '/v2/gateway/api/create',
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Content-Length': Buffer.byteLength(requestBody)
            //     }
            // }

            // return new Promise((resolve, reject) => {
            //     const req = https.request(options, res => {
            //         console.log(`Status: ${res.statusCode}`);
            //         console.log(`Headers: ${JSON.stringify(res.headers)}`);
            //         res.setEncoding('utf8');
            //         res.on('data', (body) => {
            //             console.log('Body: ');
            //             console.log(body);
            //             console.log('payUrl: ');
            //             var urlPayment = JSON.parse(body).payUrl
            //             resolve(urlPayment);
            //         });
            //         res.on('end', () => {
            //             console.log('No more data in response.');
            //         });
            //     })

            //     req.on('error', (e) => {
            //         console.log(`problem with request: ${e.message}`);
            //         reject(error);
            //     });
            //     // write data to request body
            //     req.write(requestBody);
            //     req.end();
            // })


            // test momo:
            // NGUYEN VAN A
            // 9704 0000 0000 0018
            // 03/07
            // OTP
            // các thông tin đổi để hiện trên Hóa đơn thanh toán: orderInfo, ,amount, orderID,...
            //Đổi redirectURL, ipnURL theo trang web của mình

            var accessKey = 'F8BBA842ECF85';
            var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';//key để test // không đổi
            var orderInfo = 'pay with MoMo'; // thông tin đơn hàng
            var partnerCode = 'MOMO';
            var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'; // Link chuyển hướng tới sau khi thanh toán hóa đơn
            var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';   //trang truy vấn kết quả, để trùng với redirect
            var requestType = "payWithMethod";
            var amount = '1000'; // Lượng tiền của hóa  <lượng tiền test ko dc cao quá>
            var orderId = partnerCode + new Date().getTime(); // mã Đơn hàng, có thể đổi
            var requestId = orderId;
            var extraData =''; // đây là data thêm của doanh nghiệp (địa chỉ, mã COD,....)
            var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
            var orderGroupId ='';
            var autoCapture =true;
            var lang = 'vi'; // ngôn ngữ

            // không đụng tới dòng dưới
            var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
            //puts raw signature
            console.log("--------------------RAW SIGNATURE----------------")
            console.log(rawSignature)
            //chữ ký (signature)
            const crypto = require('crypto');
            var signature = crypto.createHmac('sha256', secretKey)
                .update(rawSignature)
                .digest('hex');
            console.log("--------------------SIGNATURE----------------")
            console.log(signature)

            // data gửi đi dưới dạng JSON, gửi tới MoMoEndpoint
            const requestBody = JSON.stringify({
                partnerCode : partnerCode,
                partnerName : "Test",
                storeId : "MomoTestStore",
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                lang : lang,
                requestType: requestType,
                autoCapture: autoCapture,
                extraData : extraData,
                orderGroupId: orderGroupId,
                signature : signature
            });
            // tạo object https
            const https = require('https');
            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody)
                }
            }
            //gửi yêu cầu tới momo, nhận lại kết quả trả về 
            // Link chuyển hướng tới momo là payUrl, trong phần body của data trả về
            return new Promise((resolve, reject) => {
                const req = https.request(options, res => {
                    console.log(`Status: ${res.statusCode}`);
                    console.log(`Headers: ${JSON.stringify(res.headers)}`);
                    res.setEncoding('utf8');
                    res.on('data', (body) => {
                        console.log('Body: ');
                        console.log(body);
                        resolve(JSON.parse(body));
                        console.log('resultCode: ');
                        console.log(JSON.parse(body).resultCode);
                    });
                    res.on('end', () => {
                        console.log('No more data in response.');
                    });
                })

                req.on('error', (e) => {
                    console.log(`problem with request: ${e.message}`);
                    reject(error)
                });
                // write data to request body
                console.log("Sending....")
                req.write(requestBody);
                req.end();
            })
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }
}

module.exports = UserService;