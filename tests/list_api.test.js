const mongoose = require('mongoose');
const supertest = require('supertest');
const listHelper = require('../utils/list_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

describe('api test when feed in some initial blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    // eslint-disable-next-line no-restricted-syntax
    for (const blog of listHelper.initialBlogs) {
      const blogObject = new Blog(blog);
      // eslint-disable-next-line no-await-in-loop
      await blogObject.save();
    }
  });
  test.only('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test.only('the right amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    // console.log(response.body);
    expect(response.body.length).toBe(listHelper.initialBlogs.length);
  });

  test.only('there is a property named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});
afterAll(() => {
  mongoose.connection.close();
});
