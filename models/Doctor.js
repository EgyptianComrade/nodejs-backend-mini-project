const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String
});

module.exports = mongoose.model('Doctor', doctorSchema);
 