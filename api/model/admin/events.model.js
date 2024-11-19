const mongoose = require('mongoose');

/**
 * Events Schema
 * @private
 */
const eventsSchema = new mongoose.Schema({
    event_name: {
        maxlength: 80,
        type: String,
        index: true,
        trim: true,
    },
    categories: {
        type: String,
        index: true,
        trim: true,
    },
    start_date: {
        type: String,
        index: true,
        trim: true,
    },
    end_date: {
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
module.exports = mongoose.model('events', eventsSchema);
