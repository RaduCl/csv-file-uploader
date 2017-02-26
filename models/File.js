const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  storageName: String,
  originalName: String,
  path: String,
  status: String,
  uploadStartDate: Date,
  size: Number,
  emailColumn: Number
}, { 
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true}
});


const File = mongoose.model('File', fileSchema);
/**
 * Helper method for getting file upload duration.
 */

fileSchema.virtual('duration').get(function () {
  var date1 = this.uploadStartDate;
  var date2 = this.createdAt;
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffDays = Math.ceil(timeDiff / 1000); 
  return diffDays
});
module.exports = File;
