const mongoose = require('mongoose');

/**
 * Users Schema
 * @private
 */
const usersSchema = new mongoose.Schema({
    name: {
        maxlength: 80,
        type: String,
        index: true,
        trim: true,
    },
    exhibitor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exhibitors",
    },
    user_id: {
        type: String,
        maxlength: 15,
        index: true,
        trim: true,
    },
    email: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    password: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    is_active: {
        type: Boolean,
    },

}, {
    timestamps: true,
});


/**
 * @typedef users
 */
module.exports = mongoose.model('users', usersSchema);
