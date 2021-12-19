const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    senderEmail: String,
    targetEmail: String,
    task: String
})

module.exports = mongoose.model('Tasks', TaskSchema);