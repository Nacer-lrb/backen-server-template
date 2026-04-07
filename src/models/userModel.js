const Joi = require("joi");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
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
      index: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
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
  },
  {
    timestamps: true,
  }
);




userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});



const passwordSchema = Joi.string()
  .min(8)
  .max(30)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .required();



const schemaJoiRef = Joi.object({
  firstname: Joi.string().min(1).max(50).trim().required(),
  lastname: Joi.string().min(1).max(100).trim().required(),
  username: Joi.string().alphanum().min(3).max(20).trim().required(),
  email: Joi.string().email().max(255).trim().required(),
  gender: Joi.string().valid("male", "female").required(),
  password: passwordSchema,
});



const loginSchemaJoiRef = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).trim(),
  email: Joi.string().email().max(255).trim(),
  password: Joi.string().required()
}).or("username", "email");



const schemaUpdateRef = Joi.object({
  firstname: Joi.string().trim().min(2).max(50),
  lastname: Joi.string().trim().min(2).max(50),
  gender: Joi.string().valid("male", "female"),
  phoneNumber: Joi.string().pattern(/^\+?\d{7,15}$/),
  civility: Joi.string().valid("Mr", "Ms"),
  birthdate: Joi.date().less("now").iso(),
  address: Joi.string().trim().max(255),
  town: Joi.string().trim().max(100),
  postalCode: Joi.string().trim().max(20),
  country: Joi.string().trim().max(100),
}).min(1);



const handle = mongoose.model("User", userSchema);

module.exports = {
  passwordSchema,
  loginSchemaJoiRef,
  schemaJoiRef,
  schemaUpdateRef,
  handle,
};