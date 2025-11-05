const User = require("../models/userModel")
const AppError = require("../utils/AppErrors")
const bcrypt = require("bcrypt")
const validateReq = require("../utils/validateReq")
const { generateToken } = require("../utils/tokenHandler")

// register
const addUserToDb =  async(user)=>{
    let existsUsername
    let existsEmail = await User.handle.findOne( { email : user.email } )
    if(!existsEmail) existsUsername = await User.handle.findOne({ username : user.username })

    if (existsUsername || existsEmail){
	const captur = ( existsUsername ? "username" :  "email" ) + " is already in use"
	
	throw new AppError("INVALID_INFORMATION", captur ,408)
    }

    const newUser = new User.handle(user)
    await newUser.hashPassword()
    try {
      await newUser.save()
    } catch (error) {
      console.error("Error saving user:", error)
      throw new AppError("DATABASE_ERROR", "Failed to save user", 500)
    }
    return newUser 
}

// login
const userCanLog = async(user)=>{
    let verifyPass 
    const exists = await User.handle.findOne(
	user.email ? { email : user.email} :
        { username : user.username }
    ) 
    if(!exists) throw new AppError("INVALID_INFORMATION" , "user not found" , 404)
    verifyPass = await bcrypt.compare(user.password , exists.password )

    if(!verifyPass)  throw new AppError("INVALID_INFORMATION" , "wrong email or password" , 300)

    // if (!exists.isEmailVerified)  throw new AppError("EMAIL_ERRPR" , "email not verrified" , 401)

    return exists
}


// curent user informations
const getUserInfo = async(userID)=>{
    const user = await User.handle.findById(userID)

    return user
}

// change password .. ps the  user must be loged in
const verifyPassAndEdit = async(userID , payload)=>{
    const user = await User.handle.findById(userID)

    if(!user) throw new AppError("USER_ERROR" , "user not found",404)

    const verifiaction = await bcrypt.compare(payload.oldPassword , user.password)
    if(!verifiaction) throw new AppError("CHANGE_PASSWORD_ERROR","incorrect password",404)

    validateReq( User.passwordSchema , payload.newPassword)

    if( (payload.newPassword !== payload.confirmPassword) || (payload.oldPassword == payload.newPassword) ){
	throw new AppError("CHANGE_PASSWORD_ERROR",`${ payload.newPassword !== payload.confirmPassword ?
	    "the new password and the confirme password must be the same":
	    "the new password must be different then the old one"

	}` , 404)
    }

    const salt = await bcrypt.genSalt(10);
    const newpass = await bcrypt.hash(payload.newPassword, salt);

    const update = await User.handle.findOneAndUpdate({username:user.username},{password:newpass})


    
    return update
}

const genTokenReset= async(email)=>{
    if(!email) throw new AppError("BODY_ERR","missing informations",500)
    const user = await User.handle.findOne({email:email}) 
    if(!user) throw new AppError("USER_ERR","user not found",404)
    const token = generateToken(user , "reset_password")
    return token
}


const resetPassword=async(userID , payload)=>{
    const user = await User.handle.findById(userID)

    if(!user) throw new AppError("USER_ERROR" , "user not found",404)


    validateReq( User.passwordSchema , payload.newPassword)

    const verifyPass = await bcrypt.compare(payload.newPassword , user.password )
    if( (payload.newPassword !== payload.confirmPassword) || verifyPass ){
	throw new AppError("CHANGE_PASSWORD_ERROR",`${ payload.newPassword !== payload.confirmPassword ?
	    "the new password and the confirme password must be the same":
	    "the new password must be different then the old one"

	}` , 404)
    }

    const salt = await bcrypt.genSalt(10);
    const newpass = await bcrypt.hash(payload.newPassword, salt);

    const update = await User.handle.findOneAndUpdate({username:user.username},{password:newpass})


    
    return update

}

const editProfile=async(userID,informations)=>{
    const alowedKeys= ["firstname","lastname","gender","phoneNumber","civility","birthdate","address","country","town","postalCode"]
    const objectKeys=Object.keys(informations)
    let refusedKeys = objectKeys.filter((e) => !alowedKeys.includes(e) || !informations[e]);
    for(const p of refusedKeys){
	delete informations[p]
    }
    if(Object.keys(informations).length == 0 ) throw new AppError("INVALID_INFORMATION","you are trying change not allowed informations",400)
    let res=false 
    validateReq(User.schemaUpdateRef,informations)
    const updateProfile = await  User.handle.findOneAndUpdate( {_id:userID} , informations)
    if (!updateProfile) throw new AppError("INTERNAL_ERROr","somthing went wrong",500)
    res=true
    return res
}

module.exports= {
    resetPassword,
    genTokenReset,
    addUserToDb ,
    userCanLog ,
    getUserInfo,
    verifyPassAndEdit,
    editProfile
}
