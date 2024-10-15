const User = require("../models/users");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
} = require("../middleware/passwordEncrypt");
const redisClient = require("../config/redisdb");

exports.signUp = async (req, res) => {
  const { username, email, phone, password, confirmPassword } = req.body;
  try {
    if (!username || !email || !phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json("Missing fields.Please enter all the fields.");
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Failed", error: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Failed",
        error: "Email is already in use. Please use a different email",
      });
    }

    const encrypted_password = await hashPassword(password);

    const newUser = new User({
      username,
      email,
      phone,
      password: encrypted_password,
    });
    await newUser.save();

    await redisClient.hSet(
      `user:${email}`,
      JSON.stringify({
        username,
        email,
        phone,
      })
    );

    res
      .status(201)
      .json({ message: "User Registered Successfully", data: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "User Registration Failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json("Missing fields.Please enter both the fields.");
    }

    const cachedUser = await redisClient.get(`user:${email}`);
    let user;

    if (cachedUser) {
      // If user found in cache, use cached data
      user = JSON.parse(cachedUser);
      console.log("User data fetched from cache.");
    } else {
      // If not cached, query the database
      user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Email is not registered. Do registration first." });
      }

      // Cache the user data after fetching from DB (cache indefinitely)
      await redisClient.set(`user:${email}`, JSON.stringify(user));
    }
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ message: "Email is not registered. Do registeration first" });
    // }

    const password_match = await comparePassword(password, user.password);
    if (!password_match) {
      return res.status(401).json("Wrong Password");
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.LOGIN_EXPIRES,
    });
    res.status(200).json({
      success: true,
      message: "Login Successfully Done",
      token,
      // userData: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "User Login Failed" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    // const usersData = users.map(user => {
    //   const { username, phone, email } = user;
    //   return { username, phone, email };
    // });
    // await redisClient.SETEX("allUsers", 60, {username, phone, email});

    // await redisClient.SETEX("allUsers", 60, JSON.stringify(users));
    await redisClient.json.SET("allUsers", "$", JSON.stringify(users));
    await redisClient.expire("allUsers", 60);
    // await redisClient.HMGET("allUsers", "users", JSON.stringify(users));


    if (!users) {
      res.status(400).json({ message: "No Users Found" });
    }

    res.status(200).json({ message: "Success", data: users });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await redisClient.SETEX("userById", 30, JSON.stringify(user));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();
    res.status(200).json({ message: "Success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};
