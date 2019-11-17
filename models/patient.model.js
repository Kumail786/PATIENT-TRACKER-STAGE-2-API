const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  doctorid: String,
  name: String,
  disease: String,
  dateOfArrival: String,
  history: Array



}, {
  timestamps: true,
});

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;