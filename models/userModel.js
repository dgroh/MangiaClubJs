const mongoose = require('mongoose');

const { Schema } = mongoose;

const userModel = new Schema(
  {
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    hashedPassword: { type: String },
    passwordSalt: { type: String },
    phone: { type: String },
    published: { type: Boolean },
    createdDatetime: { type: String },
  },
);

module.exports = mongoose.model('User', userModel);
