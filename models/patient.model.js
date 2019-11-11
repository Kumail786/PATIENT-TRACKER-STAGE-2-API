const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
 name : String,
 disease : String,
dateOfArrival : String,
history : Array
  


}, {
  timestamps: true,
});

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;