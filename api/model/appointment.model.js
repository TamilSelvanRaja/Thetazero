const mongoose = require('mongoose');

/**
 * Appointment Schema
 * @private
 */
const appointmentSchema = new mongoose.Schema({
    visitor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "visitors",
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
