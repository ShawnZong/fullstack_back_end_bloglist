const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/blogs', async (request, response) => {
  const blogTmp = request.body;
  if (!blogTmp.likes) {
    blogTmp.likes = 0;
  }
  const blog = new Blog(blogTmp);

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog.toJSON());
});

module.exports = blogsRouter;
