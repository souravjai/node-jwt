const validator = require('validator');

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'invalid email']
    },
    password: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
})

const User = mongoose.model('user', UserSchema)

module.exports = User