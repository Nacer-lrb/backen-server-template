const authServices = require("../services/authServices")
const User = require("../models/userModel")
const getReq = require("../utils/getReq")
const { generateToken, generateRefreshToken, validateToken } = require("../utils/tokenHandler")
const AppError = require("../utils/AppErrors")
const validateReq = require("../utils/validateReq")



const createNewUser = async (req,res) =>{
    validateReq(User.schemaJoiRef , req.body)
    const newUser = getReq( req.body )
    const result = await  authServices.addUserToDb(newUser)
    res.status(201).json({status: "success" , data: result} )
}


const loginUser = async (req , res )=>{
//    validateReq(User.loginSchemaJoiRef , req.body )
    const userToLogin = getReq(req.body)
    const user = await authServices.userCanLog(userToLogin)
    const token = generateToken(user) 
    const refreshToken = generateRefreshToken(user)
    res.status(200).json({status: "success" ,  accessToken : token , refreshToken : refreshToken ,data: user })
}


const getUserInfo = async(req,res)=>{
    const userID = req.user.id 
    const userInfo = await authServices.getUserInfo(giugu.yfyfu)
    
    res.status(200).json({status:"success", data:userInfo})
}













const requestEmail = async(req,res)=>{
    const email = req.body.email
    const sendOtpToEmail = await authServices.sendOtpEmail(email , "email verifcation", req)
    res.status(200).json({status:"success", message:`check your email ${email}`})
}

const verifyEmail =async(req,res)=>{
    const payload = req.body
    const verifyEmailOtp = await authServices.verifyEmailPayload(payload ,"email verifcation")
    if(!verifyEmailOtp) throw new AppError("INTERNAL_ERROR_OTP","une erreur s est produite",500)
    res.status(200).json({status:"success",message:"email verified successfully"})
}


const tokenRefresher = async (req , res ) => {
   const refreshToken = req.body.refreshToken.split(" ")[1]
   const decoded = validateToken(refreshToken , "refreshToken") 
   const newAccesstoken = generateToken(decoded)
    
   res.status(200).json({status: "sucess" , accessToken : newAccesstoken })
}



const changePassword = async(req,res)=>{
    const userID = req.user.id
    const payload = req.body
    const verifyPassAndEdit =  await authServices.verifyPassAndEdit(userID , payload)
    res.status(200).json({status:"success", message:"password changed succesfully"})
}

const forgotPassword = async(req,res)=>{
    const { email } = req.body 
    const sendEmailOtp = await authServices.sendOtpEmail(email , "reset password" , req)
    res.status(200).json({status:"success", message:`check your email ${email}`})
}

const verifyResetOtp =async(req,res)=>{
    const payload = req.body
    const verifyResetOtp = await authServices.verifyEmailPayload(payload , "reset password")
    if(!verifyResetOtp) throw new AppError("INTERNAL_ERROR_OTP","une erreur s est produite",500)
    const token = await authServices.genTokenReset(payload.email)
    res.status(200).json({status:"success",message:"use this token for reset the password" , tokenReset:token})

}

const resetPassword = async(req,res)=>{
    if( !req.user.scope || req.user.scope !== "reset_password") throw new AppError("INAUTHORIZED", "inauthorized to reset password",401)
    const userID=req.user.id
    const payload = req.body
    const resetPassword = await authServices.resetPassword(userID,payload)
    res.status(200).json({status:"success",message:"password changed successfully"})


}


const editProfile = async(req,res)=>{
    const userID=req.user.id
    const body=getReq(req.body)
    const successEditing=await authServices.editProfile(userID , body)
    if(!successEditing) throw new AppError("INTERNAL_ERROR","problem occured edditing the profil informations")
    res.status(200).json({status:"success",message:"informations changed successfully"})
}
module.exports = {
    resetPassword,
    verifyResetOtp,
    createNewUser,
    loginUser ,
    tokenRefresher,
    requestEmail,
    verifyEmail , 
    getUserInfo ,
    changePassword,
    forgotPassword,
    editProfile
}
