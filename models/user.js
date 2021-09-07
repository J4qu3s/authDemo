const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'You can not have empty username']
    },
    password: {
        type: String,
        required: [true, 'You can not have empty password!']
    }
})

module.exports = mongoose.model('User', userSchema);