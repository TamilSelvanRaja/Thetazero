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
