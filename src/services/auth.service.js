const jwt = require('jsonwebtoken')

class AuthService {
    static verifyToken = (req, res, next) => {
        const token = req.headers['authorization']
        console.log(req.headers)
        if (token){
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        message: 'Invalid token'
                    })
                }
                req.decoded = decoded;
                next();
            })
        }else{
            return res.status(401).json({
                message: 'You are not authorized to access'   
            })
        }
    }
}

module.exports = AuthService;