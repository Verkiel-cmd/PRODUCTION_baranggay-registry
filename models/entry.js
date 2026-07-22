const mongoose = require('mongoose');
 
     const entrySchema = new mongoose.Schema({
       ref: { type: String, required: true, unique: true },
       title: { type: String, required: true },
       category: { type: String, required: true },
       purok: { type: String, required: true },
       date: { type: String, required: true },
       status: { type: String, default: 'pending' },
       note: { type: String }
     });
     module.exports = mongoose.model('Entry', entrySchema);