const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const getData = require('../utils/index');
const role = require('../configs/config.role');
const AuthService = require('./auth.service')

class AccessService {
    // [POST]/v1/api/signup
    static signup = async({email, password}) => {
       try {
            const existUser = await userModel.findOne({ email }).lean()
            if (existUser) {
                return {
                    statusCode: 201,
                    message: "User already exists"
                }
            }

            const salt = await bcrypt.genSalt()
            const passwordHash = await bcrypt.hash(password, salt)

            const newUser = await userModel.create({
                email: email,
                password: passwordHash,
                roles: [role.USER]
            })

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.HOST_EMAIL,
                    pass: process.env.APP_PASSWORD
                }
            })

            var mailoptions = {
                from: process.env.HOST_EMAIL,
                to: newUser.email,
                subject: 'Thanks for Registration - NetLeak',
                html: '<b style="font-size: 50px">Bạn đã đăng ký thành công tài khoản NetLeak!!</b>'
            }

            transporter.sendMail(mailoptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return getData({ fields: ['_id', 'email'], object: newUser})
       } catch (error) {
            return {
                error: error.message
            }
       }
    }
    // [POST]/v1/api/login
    static login = async({email, password}, res) => {
        try {
            const existUser = await userModel.findOne({email})
            if (!existUser) {
                return {
                    statusCode: 201,
                    message: "User not registered"
                }
            }
            const match = await bcrypt.compare(password, existUser.password);
            if (!match) {
                return {
                    statusCode: 401,
                    message: 'Wrong Password'
                }
            }

            const payload = {id: existUser.id, email};

            const accessToken = AuthService.createAccessToken(payload);

            const refreshToken = AuthService.createRefreshToken(payload);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 14,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
            })

            return {
                user: getData({fields: ['_id', 'email', 'favorites', 'roles'], object: existUser}),
                accessToken,
            }
            
        } catch (error) {
            console.log(error.message)
        }
    }
}

module.exports = AccessService;