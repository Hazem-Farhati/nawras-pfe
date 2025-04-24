const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  username: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
  },
  user_img: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isActivated: { type: Boolean, default: false },
  activationToken: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
