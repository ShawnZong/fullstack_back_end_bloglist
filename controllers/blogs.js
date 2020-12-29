const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
  const blogTmp = request.body;
  if (!blogTmp.likes) {
    blogTmp.likes = 0;
  }
  const blog = new Blog(blogTmp);

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  // console.log(request.params.id);
  response.status(204).end();
});
blogsRouter.put('/:id', async (request, response) => {
  const tmpBlog = request.body;
  // console.log(tmpBlog);
  const newBlog = {
    title: tmpBlog.title,
    author: tmpBlog.author,
    url: tmpBlog.url,
    likes: tmpBlog.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  response.json(updatedBlog.toJSON());
});
module.exports = blogsRouter;
