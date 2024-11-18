const mongoose = require('mongoose');

/**
 * Exhibitor Schema
 * @private
 */
const exhibitorSchema = new mongoose.Schema({
    name: {
        maxlength: 80,
        type: String,
        index: true,
        trim: true,
    },
    cat_id: {
        maxlength: 80,
        type: String,
        index: true,
        trim: true,
    },
    stall_id: {
        maxlength: 80,
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
module.exports = mongoose.model('exhibitors', exhibitorSchema);
