const catchAsync = require("./../utils/catchAsync");
const appError = require("../utils/appError");
const Post = require("../models/post.model");
const mongoose = require("mongoose");
const { HOST } = require("../config/config");

module.exports.createPost = catchAsync(async (req, res, next) => {
  console.log("body:", req.body);
  console.log("file:", req.file);
  if (req.file) {
    req.body.image = `${HOST}/${req.file.filename}`;
  }
  if (!req.body.content.trim())
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
  if (!blogPost) return next(new appError("Could not find the post", 404));

  if (blogPost.status === "Deleted")
    return next(new appError("This post has been delete", 400));
  res.status(200).json({ message: "success", blogPost });
});

module.exports.getPosts = catchAsync(async (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const perPage = 20;
  const skip = (page - 1) * perPage;

  const query = { status: "Active" };

  if (req.query.userId) {
    query.userId = mongoose.Types.ObjectId(req.query.userId);
  }

  const blogPosts = await Post.aggregate([
    {
      $match: query,
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: perPage,
    },
  ]);

  res.status(200).json({ message: "success", blogPosts, page });
});

module.exports.updatePost = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.image = `${HOST}/${req.file.filename}`;
  }

  const blogPost = await Post.findById(req.params.id);

  if (!blogPost) return next(new appError("Could not find the post", 404));
  console.log("blogPost", blogPost);
  console.log("user", req.user);
  if (blogPost.userId.toString() !== req.user._id.toString())
    return next(new appError("This post does not belong to you", 401));

  if (req.body.content.trim()) blogPost.content = req.body.content.trim();
  if (req.body.image) blogPost.image = req.body.image;

  await blogPost.save();
  res.status(200).json({ message: "success", blogPost });
});

module.exports.deletePost = catchAsync(async (req, res, next) => {
  const blogPost = await Post.findById(req.params.id);
  if (!blogPost) return next(new appError("Could not find the post", 404));
  if (blogPost.userId.toString() !== req.user._id.toString())
    return next(new appError("This post does not belong to you", 401));
  blogPost.status = "Deleted";
  await blogPost.save();

  res.status(204).json();
});

module.exports.likePost = catchAsync(async (req, res, next) => {
  const blogPost = await Post.findById(req.params.id);
  if (!blogPost) return next(new appError("Could not find the post", 404));
  await Post.findByIdAndUpdate(req.params.id, {
    $addToSet: { likes: req.user },
  });
  res.status(200).json({ message: "success" });
});

module.exports.unlikePost = catchAsync(async (req, res, next) => {
  const blogPost = await Post.findById(req.params.id);
  if (!blogPost) return next(new appError("Could not find the post", 404));
  await Post.findByIdAndUpdate(req.params.id, {
    $pull: { likes: req.user },
  });

  res.status(200).json({ message: "success" });
});
