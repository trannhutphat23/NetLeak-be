const userModel = require('../models/user.model');
const movieModel = require('../models/movie.model');
const savedMovieModel = require('../models/saved_movie.model')
const historyModel = require('../models/history.model')
const videoModel = require('../models/video.model');
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const https = require('https');
const qs = require('querystring');
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
            if (id.length > 24) {
                return {
                    success: false,
                    message: "User does not exist"
                }
            }
            const existUser = await userModel.findById(id).lean()

            if (!existUser) {
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
            if (!film){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

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

                return {
                    success: true,
                    message: "Save successfully",
                    film: getData({ fields: ['_id', 'userId', 'filmId'], object: formatSavedFilm })
                }
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

    static addFavoriteFilm = async ({ filmId, userId }) => {
        try {
            const movie = await movieModel.findById(filmId)
            const user = await userModel.findById(userId)

            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            if (!movie){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

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
                user.favorites.push(filmId)
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

    static deleteFavoriteFilm = async ({ filmId, userId }) => {
        try {
            const movie = await movieModel.findById(filmId)
            const user = await userModel.findById(userId)

            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            if (!movie){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

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

    static getFavoriteFilm = async ({ userId }) => {
        try {
            const user = await userModel.findById(userId).populate({
                path: "favorites",
                select: '_id plot genres cast image title fullplot released directors imdb type'
            })

            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            const movies = user.favorites

            return movies

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static getVideo = async ({ filmId }) => {
        try {
            const video = await videoModel.findOne({ filmId: filmId })
            
            let videoList = []

            if(video){
                videoList = video.videoList
            }

            if (video) {
                return videoList
            }
            else {
                return {
                    success: false,
                    message: "Can not find film",
                }

            }

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static getDetailFilm = async ({ filmId }) => {
        try {
            const film = await movieModel.findById(filmId).populate({
                path: "cast",
                select: '_id avatar name description movies'
            }).populate({
                path: "directors",
                select: '_id name movies'
            })
            const video = await videoModel.findOne({filmId: filmId})
            const allFilms = await movieModel.find()

            if (!film){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            let detailFilm = getData({
                fields: ['cast', 'directors'],
                object: film
            })

            detailFilm.videoList = video.videoList

            const genreList = film.genres
            console.log(genreList)
            let recommendedFilms = []

            //đề xuất 15 bộ
            // for(let i=0;i<15;i++)
            //test
            for(let i=0;i<3;i++)
            {
                const ranNumGenre = Math.floor(Math.random() * genreList.length)

                do{
                    const ranNumFilm = Math.floor(Math.random() * allFilms.length)

                    if (allFilms[ranNumFilm].genres.some(genre => genre.toString() == genreList[ranNumGenre].toString())) {
                        if (
                            recommendedFilms.some(id => {
                                return id.toString() == allFilms[ranNumFilm]._id.toString()
                            })
                        ) { }
                        else {
                            recommendedFilms.push(allFilms[ranNumFilm]._id)
                            break
                        }   
                    }
                }
                while(true)
            }

            detailFilm.recommendedFilms = recommendedFilms

            return detailFilm

        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static addHistory = async ({userId, filmId}) => {
        try {
            const user = await userModel.findById(userId)
            const film = await movieModel.findById(filmId)
            if (!film){
                return {
                    success: false,
                    message: "Film does not exist"
                }
            }

            const existHistoryFilm = await historyModel.findOne({ userId: user._id })
            if (existHistoryFilm) {
                const historyFilm = await historyModel.findOneAndUpdate({ userId: user._id, filmId: { $nin: [film._id] } }, {
                    $push: { filmId: film._id }
                });
                if (historyFilm) {
                    const formatHistoryFilm = await (await historyFilm.populate({
                        path: "filmId",
                        select: '_id plot title fullplot released lastupdated type'
                    })).
                    populate({
                        path: "userId",
                        select: '_id email name sexuality phone favorites roles'
                    })
                    return getData({ fields: ['_id', 'userId', 'filmId'], object: formatHistoryFilm });
                }
                return {
                    success: false,
                    message: "Film already stored in history"
                }
            } else {
                const newHistoryFilm = new historyModel({
                    userId: user._id,
                    filmId: [film._id]
                })
                const historyFilm = await newHistoryFilm.save()
                const formatHistoryFilm = await (await historyFilm.populate({
                    path: "filmId",
                    select: '_id plot title fullplot released lastupdated type'
                })).
                populate({
                    path: "userId",
                    select: '_id email name sexuality phone favorites roles'
                })

                return {
                    success: true,
                    message: "Add history successfully",
                    film: getData({ fields: ['_id', 'userId', 'filmId'], object: formatHistoryFilm })
                }

            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static deleteHistoryFilm = async ({userId, filmId}) => {
        try {
            const user = await userModel.findById(userId)
            if (!user){
                return {
                    success: false,
                    message: "User does not exist"
                }
            }

            const film = await movieModel.findById(filmId)
            const existHistoryFilm = await historyModel.findOne({ userId: user._id, filmId: film._id })
            if(existHistoryFilm){
                const delHistoryFilm = await historyModel.findOneAndUpdate({ userId: user._id, filmId: { $in: [film._id] } }, {
                    $pull: { filmId: film._id }
                });
                return {
                    success: true,
                    message: "Delete successfully",
                }
            }
            return {
                success: false,
                message: "Film not in history"
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static paymentByMoMo = async ({amount, orderInfo, redirectUrl}) => {
        try {
            // test momo:
            // NGUYEN VAN A
            // 9704 0000 0000 0018
            // 03/07
            // OTP
            // các thông tin đổi để hiện trên Hóa đơn thanh toán: orderInfo, ,amount, orderID,...
            //Đổi redirectURL, ipnURL theo trang web của mình
            var accessKey = 'F8BBA842ECF85';
            var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';//key để test // không đổi
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

    static paymentByVNPay = async () => {
        try {
            const now = new Date();
            // Get the year, month, day, hours, minutes, and seconds
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            // Concatenate the values in the desired format
            const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

            const vnp_TmnCode = "B61COPZQ"; // Your VNPay TMN code
            const vnp_Amount = 10000; // Amount in VNĐ
            const vnp_BankCode = "NCB"; // Bank code (example: NCB - Ngan hang NCB)
            const vnp_OrderInfo = "Pay";
            const vnp_ReturnUrl = "https://google.com"; // Return URL after payment completed
            const vnp_IpAddr = "127.0.0.1"; // Client IP Address

            const rawData = {
                vnp_TmnCode: vnp_TmnCode,
                vnp_Amount: vnp_Amount, // Amount in cents
                vnp_BankCode: vnp_BankCode,
                vnp_OrderInfo: vnp_OrderInfo,
                vnp_ReturnUrl: vnp_ReturnUrl,
                vnp_IpAddr: vnp_IpAddr
            };

            // Sort the data alphabetically
            const sortedData = Object.keys(rawData)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = rawData[key];
                    return acc;
                }, {});

            const queryString = qs.stringify(sortedData);

            // Add vnp_SecureHash to the query string
            const vnp_HashSecret = "UISPNQJGKTNQFEPMOYYWSXDVSZAQTMTW"; // Your VNPay hash secret
            const secureHash = require('crypto')
                .createHash('sha256')
                .update(vnp_HashSecret + queryString)
                .digest('hex');

            const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Command=pay&vnp_Version=2.1.0&vnp_TxnRef=5&vnp_OrderType=other&vnp_Locale=vn&vnp_CreateDate=${formattedDateTime}&vnp_CurrCode=VND&${queryString}&vnp_SecureHash=${secureHash}`;
            
            return paymentUrl;
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }
}

module.exports = UserService;