const Joi = require("joi")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    points:{
	type:Number,
	required:true,
	default:0 
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
	type: String,
	default: null,
        trim: true,
    },
    civility: {
        type: String,
        enum: ["Mr", "Ms"],
        default: null,
        trim: true,
      },
    birthdate: {
        type: Date,
        default: null,
      },
    address: {
        type: String,
        default: null,
      },
    town: {
        type: String,
        default: null,
        trim: true,
      },
    postalCode: {
        type: String,
        default: null,
        trim: true,
      },
    country: {
        type: String,
        default: null,
        trim: true,
      },

}, {
    timestamps: true,
});

userSchema.methods.hashPassword = async function () {
  const salt = await bcrypt.genSalt(10);
  let pass = await bcrypt.hash(this.password, salt);
  this.password = pass;
};

const passwordSchema  = Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
        'string.pattern.base': 'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un symbole.',
        'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
        'any.required': 'Mot de passe requis.',
    });

// with the help of joi we gonna create a schema referance to validate 
const schemaJoiRef = Joi.object({
    firstname: Joi.string().min(1).max(50).trim().required(),
    lastname: Joi.string().min(1).max(100).trim().required(),
    username: Joi.string().alphanum().min(3).max(20).trim().required(),
    email: Joi.string().email().max(255).trim().required(),
    gender: Joi.string().valid("male", "female").required(),
    password: passwordSchema,
});

// creating a schema referance for login to validate data 
const loginSchemaJoiRef = Joi.object({
    username: Joi.string().alphanum().min(3).max(20).trim(),
    email: Joi.string().email().max(255).trim(),
    password: passwordSchema,
}).or('username', 'email');


// creating a schema referance for updatinng to validate data 
const schemaUpdateRef = Joi.object({
  firstname: Joi.string().trim().min(2).max(50).allow(null, ''),
  lastname: Joi.string().trim().min(2).max(50).allow(null, ''),
  gender: Joi.string().valid("male", "female").allow(null),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .allow(null, ''),
  civility: Joi.string()
    .valid("Mr", "Ms", "Dr", "Mx")
    .allow(null, ''),
  birthdate: Joi.date()
    .less("now")
    .iso()
    .allow(null)
    .messages({
      'date.less': 'Birthdate must be in the past',
      'date.base': 'Birthdate must be a valid ISO date',
    }),
  address: Joi.string().trim().max(255).allow(null, ''),
  town: Joi.string().trim().max(100).allow(null, ''),
  postalCode: Joi.string().trim().max(20).allow(null, ''),
  country: Joi.string().trim().max(100).allow(null, ''),
})




// here we pass our mongoose schema as a handle and extract builtin methods of mongoose to handle that (save find ..)  , 
const handle = mongoose.model("User",userSchema)

module.exports={
    passwordSchema,
    loginSchemaJoiRef ,
    schemaJoiRef ,
    schemaUpdateRef,
    handle 
}
