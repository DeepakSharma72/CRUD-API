const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 1 
    },
    hobbies: {
        type: [String],
        default: []
    }
});

const User = mongoose.model('users',userSchema);

module.exports = User;