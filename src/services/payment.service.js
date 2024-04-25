const PaymentPackageModel = require('../models/payment_package.model')
const paymentModel = require('../models/payment.model')
const userModel = require('../models/user.model')
const movieModel = require('../models/movie.model')
const getData = require('../utils/formatRes')
const _ = require('lodash');

class PaymentService {
    static addPaymentPackage = async ({title, cost, description}) => {
        try {
            const existPaymentPackage = await PaymentPackageModel.findOne({title})
            if (existPaymentPackage) {
                return {
                    success: false,
                    message: "Payment package already exists"
                }
            }
            const newPaymentPackage = new PaymentPackageModel({
                title,
                cost,
                description
            })
            const formatNewPaymentPackage = await newPaymentPackage.save()

            return getData({ fields: ["_id", "title", "cost", "description"], object: formatNewPaymentPackage})
        } catch (error) {
            return {
                success: false,
                message: error.message
            } 
        }
    }

    static updatePaymentPackage = async ({id}, {title, cost, description}) => {
        try {
            const existPaymentPackage = await PaymentPackageModel.findById(id)
            if (!existPaymentPackage){
                return {
                    success: false,
                    message: "Payment package does not exist"
                }
            }

            const data = {
                title,
                cost,
                description
            }

            const updatePaymentPackage = await PaymentPackageModel.findByIdAndUpdate(id, data, {new: true})

            return {
                success: true,
                message: "Update successfully",
                package:getData({ fields: ["_id", "title", "cost", "description"], object: updatePaymentPackage})
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static listPaymentPackage = async () => {
        try {
            const paymentPackages = await PaymentPackageModel.find().lean()

            return _.map(paymentPackages, obj => getData({ 
                fields: ["_id", "title", "cost", "description"], 
                object: obj }));
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getPaymentPackage = async ({id}) => {
        try {
            const existPaymentPackage = await PaymentPackageModel.findById(id);
            if (!existPaymentPackage) {
                return {
                    success: false,
                    message: "Payment package does not exist"
                }
            }

            return getData({ fields: ["_id", "title", "cost", "description"], object: existPaymentPackage})
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deletePaymentPackage = async ({id}) => {
        try {
            const existPaymentPackage = await PaymentPackageModel.findById(id)
            if (!existPaymentPackage){
                return {
                    success: false,
                    message: "Payment package does not exist"
                }
            }

            await PaymentPackageModel.findByIdAndDelete(id)

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
    
    static paymentByMoMo = async ({amount, orderInfo}) => {
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
            var redirectUrl = 'https://google.com'; // Link chuyển hướng tới sau khi thanh toán hóa đơn
            var ipnUrl = 'https://google.com';   //trang truy vấn kết quả, để trùng với redirect
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
        // dữ liệu trả về khi thành công: ?partnerCode=MOMO&orderId=MOMO1713984978976&requestId=MOMO1713984978976&amount=1000&orderInfo=30k&orderType=momo_wallet&transId=4029232035&resultCode=0&message=Thành+công.&payType=credit&responseTime=1713985045244&extraData=&signature=0d6f0e650eb5d320c3a65df17a620f01c09d0eae742d3eb7e84177b2ebda6fe0
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }

    static addPayment = async ({email, package_id, method, total}) => {
        try {
            const existUser = await userModel.findById(email)
            if (!existUser) {
                return {
                    success: false,
                    message: "User does not exist"
                }
            }
            const existPaymentPackage = await PaymentPackageModel.findById(package_id)
            if (!existPaymentPackage) {
                return {
                    success: false,
                    message: "Payment package does not exist"
                }
            }
            const newPayment = new paymentModel({
                email: email,
                package_id: package_id,
                method: method,
                total: total
            })
            const savedPayment = await newPayment.save()
            // const formatNewPayment = await savedPayment.populate({
            //     path: 'user',
            //     select: '_id email name'
            // })
            return savedPayment
        } catch (error) {
            return {
                success: false,
                message: error.message,
            }
        }
    }
}

module.exports = PaymentService;