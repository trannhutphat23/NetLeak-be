const jwt = require('jsonwebtoken')
const getData = require('../utils/index');

class AuthService {
    static createAccessToken = (payload) => {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
            expiresIn: '5h'
        })
        return accessToken
    }

    static createRefreshToken = (payload) => {
        const refreshToken = jwt.sign( payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '30d',
        })
        return refreshToken
    }

    static verifyToken = (req, res, next) => {
        const token = req.headers['authorization']
        if (token){
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({
                        message: 'Invalid token'
                    })
                }
                req.user = user;
                next();
            })
        }else{
            return res.status(401).json({
                message: 'You are not authorized to access'   
            })
        }
    }
    // [POST]v1/api/refreshToken
    static HandleRefreshToken = (req,res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({
                message: 'You are not authorized to access'   
            })
        }
        jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: 'Invalid token'
                })
            }
            const newAccessToken = AuthService.createAccessToken({id: user.id, email: user.email})
            const newRefreshToken = AuthService.createRefreshToken({id: user.id, email: user.email})
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 14,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
            })

            return res.status(200).json({
                accessToken: newAccessToken,
                user: getData({ fields: ['id', 'email'], object: user})
            })
        })
    }
}

module.exports = AuthService;