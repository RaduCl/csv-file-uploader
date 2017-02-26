const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: { type: String, unique: true },
  originalFileName: String,
  path: String,
  status: String,
  uploadStartDate: Date,
  duration: Number,
  emailColumn: Number
}, { timestamps: true });


const File = mongoose.model('File', fileSchema);
/**
 * Helper method for getting file upload duration.
 */
fileSchema.methods.uploadDuration = function uploadDuration() {
  var date1 = this.uploadStartDate;
  var date2 = this.createdAt;
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  return diffDays
};

module.exports = File;
