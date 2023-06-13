const express = require("express");

const {
  getUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = express.Router({ mergeParams: true });
const User = require("../models/User");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// router.use(protect);
// router.use(authorize('admin'));

router.get("/", protect, authorize("admin"), advancedResults(User), getUsers);
router.post("/", protect, authorize("admin"), createUser);
router.get("/:id", protect, authorize("admin"), getSingleUser);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);
module.exports = router;
