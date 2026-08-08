const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending','processing','completed','failed'],
            default: 'pending',
        },
        totalChunks: {
            type: Number,
            default: 0,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Document', documentSchema);

