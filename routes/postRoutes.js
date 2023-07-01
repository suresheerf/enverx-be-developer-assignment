const express = require("express");
const postController = require("./../controllers/postController");
const { protect } = require("../middleware/protect");
const router = express.Router();

router
  .route("/")
  .post(protect, postController.createPost)
  .get(postController.getPosts);
router
  .route("/:id")
  .get(postController.getPost)
  .put(postController.updatePost)
  .delete(postController.updatePost);
router.route("/like/:id").get(postController.likePost);
router.route("/unlike/:id").get(postController.unlikePost);

module.exports = router;
