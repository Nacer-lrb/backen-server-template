const AppError = require("./AppErrors")

const cleanUp = (string)=>{
    return string.replace("\"", "").replace("\"", "");
}

const validateReq = (schemaJoiRef , reqBody) => {
    const { error , value } = schemaJoiRef.validate(reqBody , {
	abortEarly:false // to show all errors and not stop on first error 	
    })
    if(error){
	const message = cleanUp(error.details[0].message)
	throw new AppError("VALIDATION_ERROR" , message , 400 )
    }

}

module.exports= validateReq
