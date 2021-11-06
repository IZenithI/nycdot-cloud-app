const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: String,
    role: String
})

module.exports = mongoose.model('Users', UserSchema);