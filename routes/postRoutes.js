const express = require("express");
const multer = require("multer");
const postController = require("./../controllers/postController");
const { protect } = require("../middleware/protect");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}.${file.mimetype.split("/")[1]}`
    );
  },
});

const upload = multer({ storage });

router
  .route("/")
  .post(protect, upload.single("image"), postController.createPost)
  .get(postController.getPosts);
router
  .route("/:id")
  .get(postController.getPost)
  .put(protect, upload.single("image"), postController.updatePost)
  .delete(protect, postController.deletePost);
router.route("/like/:id").get(protect, postController.likePost);
router.route("/unlike/:id").get(protect, postController.unlikePost);

module.exports = router;
