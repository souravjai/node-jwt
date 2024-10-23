const validator = require('validator');
const bycrpt = require('bcrypt');

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

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bycrpt.compare(password, this.password);
    } catch (err) {
        console.log(err);
    }

}

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bycrpt.genSalt(10)
        const hashedPassword = await bycrpt.hash(this.password, salt)
        this.password = hashedPassword;
        next()
    } catch (err) {
        next(err)
    }
})

const User = mongoose.model('user', UserSchema)

module.exports = User