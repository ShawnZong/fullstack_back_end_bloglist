const mongoose = require('mongoose');
const supertest = require('supertest');
const lodash = require('lodash');
const listHelper = require('../utils/list_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  // eslint-disable-next-line no-restricted-syntax
  for (const blog of listHelper.initialBlogs) {
    const blogObject = new Blog(blog);
    // eslint-disable-next-line no-await-in-loop
    await blogObject.save();
  }
});
describe('api test when feed in some initial blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('the right amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    // console.log(response.body);
    expect(response.body.length).toBe(listHelper.initialBlogs.length);
  });

  test('there is a property named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe('api test, post a blog', () => {
  test('post a new blog', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await listHelper.blogsInDB();
    expect(blogs.length).toBe(listHelper.initialBlogs.length + 1);

    const titles = blogs.map((blog) => blog.title);
    expect(titles).toContain('React patterns');
  });

  test('default likes should be 0', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    };
    const response = await api.post('/api/blogs').send(newBlog);
    expect(response.body.likes).toBe(0);
  });

  test('title and url are required', async () => {
    const newBlog = {
      url: 'https://reactpatterns.com/',
    };
    await api.post('/api/blogs').send(newBlog).expect(400);
  });
});

describe.only('api test delete a blog', () => {
  test('delete the first blog', async () => {
    const blogsBefore = await listHelper.blogsInDB();
    const firstBlog = lodash.first(blogsBefore);
    await api.delete(`/api/blogs/${firstBlog.id}`);
    expect(204);

    const blogsAfter = await listHelper.blogsInDB();
    expect(blogsAfter.length).toBe(listHelper.initialBlogs.length - 1);

    const titles = blogsAfter.map((tmp) => tmp.title);
    expect(titles).not.toContain(firstBlog.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
