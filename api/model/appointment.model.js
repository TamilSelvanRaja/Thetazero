const mongoose = require('mongoose');

/**
 * Appointment Schema
 * @private
 */
const appointmentSchema = new mongoose.Schema({
    app_date: {
        maxlength: 20,
        type: String,
        index: true,
        trim: true,
    },
    categories: {
        type: String,
        index: true,
        trim: true,
    },
    note: {
        type: String,
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
module.exports = mongoose.model('appointments', appointmentSchema);
