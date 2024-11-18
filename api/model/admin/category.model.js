const mongoose = require('mongoose');

/**
 * Category Schema
 * @private
 */
const categorySchema = new mongoose.Schema({
    name: {
        maxlength: 80,
        type: String,
        index: true,
        trim: true,
    },
    ref_id: {
        maxlength: 10,
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
module.exports = mongoose.model('a_categories', categorySchema);
