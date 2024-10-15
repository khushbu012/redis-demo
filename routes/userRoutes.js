const express = require("express");
const userController = require("../controllers/userController");
const { cacheMiddleware } = require("../middleware/redisMiddleware");
const router = express.Router();

router.post("/signup-user", userController.signUp);
router.post("/login-user", userController.login);
router.get(
  "/get-allusers",
  cacheMiddleware("allUsers"),
  userController.getAllUser
);
router.get(
  "/get-userbyId/:id",
  cacheMiddleware("userById"),
  userController.getUserById
);
router.put("/updateuser/:id", userController.updateUser);
router.delete("/deleteuser/:id", userController.deleteUser);

module.exports = router;
