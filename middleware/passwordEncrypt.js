const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (error) {
    res.json(error.message);
  }
};

exports.comparePassword = async (password, encrypted_password) => {
  return bcrypt.compare(password, encrypted_password);
};
