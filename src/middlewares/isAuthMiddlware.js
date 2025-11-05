const AppError = require("../utils/AppErrors");
const { validateToken } = require("../utils/tokenHandler");

const isAuth = ( req , res , next) =>{
    const headAuth = req.headers.authorization
    if (!headAuth) throw new AppError("NOT_AUTHORIZED" , "messing authorization" , 401)
    const token = headAuth.split(" ")[1]; // spliting on the space cause on the request the authorization will be like that "Bearer token" this for security stuff and scalability 

    const decoded = validateToken(token , "access")
    
    req.user = decoded     
    next()
}


module.exports=isAuth
