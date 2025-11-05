const getReq = ( reqbody  )=>{
    const newObject = {}
    Object.keys(reqbody).forEach(key => {
	newObject[key] = reqbody[key]
    })

    return newObject
}

module.exports=getReq
