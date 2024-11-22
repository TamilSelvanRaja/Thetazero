const mongoose = require('mongoose');

/**
 * Appointment Sub Schema
 * @private
 */
const appointmentSubSchema = new mongoose.Schema({
    appointment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointments",
    },
    exhibitor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointments",
    },
    app_date: {
        maxlength: 20,
        type: String,
        index: true,
        trim: true,
    },
    app_time: {
        maxlength: 20,
        type: String,
        index: true,
        trim: true,
    },
    status: {
        type: String,
        index: true,
        trim: true,
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointments",
    },
    updater_type: {
        type: String,
        index: true,
        trim: true,
    },
    reject_reason: {
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
 * @typedef appointments
 */
module.exports = mongoose.model('sub_appointment', appointmentSubSchema);
