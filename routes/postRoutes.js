const express = require("express");
const postController = require("./../controllers/postController");
const router = express.Router();

router.route("/").post(authController.createPost);
router.route("/:id").get(authController.getPost);

module.exports = router;
