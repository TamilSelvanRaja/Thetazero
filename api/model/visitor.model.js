const mongoose = require('mongoose');

/**
 * Visitors Schema
 * @private
 */
const visitorSchema = new mongoose.Schema({
    name: {
        maxlength: 80,
        type: String,
        index: true,
        trim: true,
    },
    mobile: {
        type: String,
        maxlength: 15,
        index: true,
        trim: true,
    },
    whatsapp_mobile: {
        type: String,
        maxlength: 15,
        index: true,
        trim: true,
    },
    country_code: {
        type: String,
        maxlength: 18,
        index: true,
        trim: true,
    },
    email: {
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
module.exports = mongoose.model('visitors', visitorSchema);
