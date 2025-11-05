require("dotenv").config()
const jwt = require("jsonwebtoken")
const AppError = require("./AppErrors")

const generateToken = (user ,scope )=>{
    const payload = {
	id : user._id || user.id,
	username : user.username ,
	email : user.email ,
	scope: scope || "access"
    } 
    const accessToken = jwt.sign(payload , process.env.ACCESS_TOKEN_SECRET , {
	expiresIn: process.env.JWT_A_EXPIRE 
    })
    return accessToken 
}

const generateRefreshToken = (user)=>{
    const payload = {
	id : user._id ,
	username : user.username ,
	email : user.email ,
	tel : user.tel
    }
    const refreshToken = jwt.sign(payload , process.env.REFRESH_TOKEN_SECRET , {
	expiresIn : process.env.JWT_R_EXPIRE ,
    })
    return refreshToken 
}

const validateToken =(token , type )=>{
    const secretKey = type === "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET
    const decoded = jwt.verify(token , secretKey , (error , decoded)=>{
	if (error) throw new AppError(type === "access" ? "INVALID_TOKEN" : "INVALID_REFRESH_TOKEN" , type ==="access" ? "invalid token or the token is expired ":"invalid refresh token or the refresh token is expired you must login" ,401 )
	user = decoded 
    })

    return user
}

module.exports={
    generateToken ,
    generateRefreshToken ,
    validateToken
}
