const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/password');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [2, "Name should be atleast 2 characters"],
        maxLength: [200, "Name should be less than 200 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        validate: [validator.isEmail, "Invalid Email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Minimum length should be 8"],
        validate: {
            validator: function(value) {
                return /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[!@#$%^&*()]/.test(value);
            },
            message: "Password must contain one lowercase, uppercase, number, special character"
        }
    },
    refreshToken: {
        type: String
    }
},{
    timestamps: true
});

userSchema.pre('save', hashPassword);

userSchema.methods.comparePassword = async function (inputPassword) {
    return comparePassword(inputPassword, this.password);
  };

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};
  
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

const User = mongoose.model('User', userSchema);
module.exports = User;