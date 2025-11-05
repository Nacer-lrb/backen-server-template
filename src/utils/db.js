const mongoose = require("mongoose")
const User = require("../models/userModel")

const connectToMongoDB = async(DB_URL)=>{
    let loaded = false 
    while(!loaded){
	await mongoose
	    .connect(DB_URL)
	    .then( async() =>{
		loaded=true 
		console.log("Connected to mongoDB !")
//		await migrateDataOnCrutialChange()
	
	    })
	    .catch( err => {
		console.log("Failed to connect to mongoDB retrying")
	    })
	
    }                       
}



// la fonction agui c est pour migrate un document dans une collection et les donnee sont a changer en fonction des items change ... 
const migrateDataOnCrutialChange = async () => {
  await User.handle.updateMany(
    {
      $or: [
        { phoneNumber: { $exists: false } },
        { civility: { $exists: false } },
        { birthdate: { $exists: false } },
        { address: { $exists: false } },
        { town: { $exists: false } },
        { postalCode: { $exists: false } },
        { country: { $exists: false } },
      ],
    },
    {
      $set: {
        phoneNumber: null,
        civility: null,
        birthdate: null,
        address: null,
        town: null,
        postalCode: null,
        country: null,
      },
    }
  );
  console.log("database migrated")
};
module.exports = connectToMongoDB 
