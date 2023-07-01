const catchAsync = require("./../utils/catchAsync");
const appError = require("../utils/appError");
const Post = require("../models/post.model");

module.exports.createPost = catchAsync(async (req, res, next) => {
  if (!req.body.trim())
    return next(new appError("Please enter post content", 400));
  const blogPostObject = {
    content: req.body.content.trim(),
    image: req.body.image,
    userId: req.user._id,
  };

  const blogPost = await Post.create(blogPostObject);
  res.status(201).json({ message: "success", blogPost });
});
module.exports.getPost = catchAsync(async (req, res, next) => {
  const blogPost = await Post.findById(req.params.id);
  if (blogPost.status === "Deleted")
    return next(new appError("This post has been delete", 404));
  res.status(200).json({ message: "success", blogPost });
});
module.exports.updatePost = catchAsync(async (req, res, next) => {
  const postObj = {};
  if (req.body.content.trim()) postObj.content = req.body.content;
  if (req.body.image) postObj.image = req.body.image;

  const blogPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: postObj,
    },
    { new: true }
  );
  res.status(200).json({ message: "success", blogPost });
});

module.exports.deletePost = catchAsync(async (req, res, next) => {
  const blogPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: { status: "Deleted" },
    },
    { new: true }
  );
  res.status(204).json({ message: "success" });
});
module.exports.likePost = catchAsync(async (req, res, next) => {
  const blogPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  );
  res.status(200).json({ message: "success" });
});
module.exports.unlikePost = catchAsync(async (req, res, next) => {
  const blogPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  );
  res.status(200).json({ message: "success" });
});
