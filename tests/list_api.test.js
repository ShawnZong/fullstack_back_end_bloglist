const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const lodash = require('lodash');
const config = require('../utils/config');
const listHelper = require('../utils/list_helper');
const userHelper = require('../utils/user_helper');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);
// let authorizationHeaderTmp;
beforeEach(async () => {
  await User.deleteMany({});
  // eslint-disable-next-line no-restricted-syntax
  for (const user of userHelper.initialUsers) {
    const userObj = new User(user);
    // eslint-disable-next-line no-await-in-loop
    userObj.password = await bcrypt.hash(userObj.password, config.saltRounds);
    // eslint-disable-next-line no-await-in-loop
    await userObj.save();
  }
  const firstUserHashed = await User.findOne({});

  await Blog.deleteMany({});
  // eslint-disable-next-line no-restricted-syntax
  for (const blog of listHelper.initialBlogs) {
    const blogObj = new Blog({
      title: blog.title,
      author: blog.title,
      url: blog.url,
      likes: blog.likes,
    });
    // eslint-disable-next-line no-underscore-dangle
    blogObj.user = firstUserHashed._id;
    // eslint-disable-next-line no-await-in-loop
    await blogObj.save();

    // const firstUserOriginal = lodash.first(userHelper.initialUsers);
    // // eslint-disable-next-line no-await-in-loop
    // // set authorization
    // // eslint-disable-next-line no-await-in-loop
    // const auResponse = await api.post('/api/login').send({
    //   username: firstUserOriginal.username,
    //   password: firstUserOriginal.password,
    // });
    // authorizationHeaderTmp = `bearer ${auResponse.body.token}`;
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
    expect(response.body.length).toBe(listHelper.initialBlogs.length);
  });

  test('there is a property named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe('single api test', () => {
  let authorizationHeaderTmp;
  beforeEach(async () => {
    const firstUserOriginal = lodash.first(userHelper.initialUsers);
    // eslint-disable-next-line no-await-in-loop
    // set authorization
    // eslint-disable-next-line no-await-in-loop
    const auResponse = await api.post('/api/login').send({
      username: firstUserOriginal.username,
      password: firstUserOriginal.password,
    });
    authorizationHeaderTmp = `bearer ${auResponse.body.token}`;
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
        .set({ Authorization: authorizationHeaderTmp })
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
      const response = await api
        .post('/api/blogs')
        .set({ Authorization: authorizationHeaderTmp })
        .send(newBlog);

      expect(response.body.likes).toBe(0);
    });

    test('title and url are required', async () => {
      const newBlog = {
        url: 'https://reactpatterns.com/',
      };
      await api
        .post('/api/blogs')
        .set({ Authorization: authorizationHeaderTmp })
        .send(newBlog)
        .expect(400);
    });
  });

  describe('api test delete a blog', () => {
    test('delete the first blog', async () => {
      const blogsBefore = await listHelper.blogsInDB();
      const firstBlog = lodash.first(blogsBefore);
      await api
        .delete(`/api/blogs/${firstBlog.id}`)
        .set({ Authorization: authorizationHeaderTmp })
        .expect(204);

      const blogsAfter = await listHelper.blogsInDB();
      expect(blogsAfter.length).toBe(listHelper.initialBlogs.length - 1);

      const titles = blogsAfter.map((tmp) => tmp.title);
      expect(titles).not.toContain(firstBlog.title);
    });
  });
  describe('update a blog', () => {
    test('update likes', async () => {
      const blogsBefore = await listHelper.blogsInDB();
      const tmpBlog = lodash.first(blogsBefore);
      const newBlog = {
        title: tmpBlog.title,
        author: tmpBlog.author,
        url: tmpBlog.url,
        likes: 666,
      };
      await api
        .put(`/api/blogs/${tmpBlog.id}`)
        .set({ Authorization: authorizationHeaderTmp })
        .send(newBlog)
        .expect(200);

      const blogsAfter = await listHelper.blogsInDB();
      const updatedBlog = lodash.first(blogsAfter);
      expect(updatedBlog.likes).toBe(666);
    });
  });
});
describe('users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('the right amount of users are returned', async () => {
    const response = await api.get('/api/users');
    expect(response.body.length).toBe(userHelper.initialUsers.length);
  });

  describe('post a user', () => {
    test(' with correct info', async () => {
      const newUser = {
        username: 'test',
        password: '111',
        name: 'aalto',
      };
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const users = await userHelper.usersInDB();
      expect(users.length).toBe(userHelper.initialUsers.length + 1);

      const usernames = users.map((tmp) => tmp.username);
      expect(usernames).toContain('test');
    });
    test('with wrong username', async () => {
      const newUser = {
        username: '1',
        password: '111',
        name: 'aalto',
      };
      await api.post('/api/users').send(newUser).expect(400);

      delete newUser.username;
      await api.post('/api/users').send(newUser).expect(400);
    });
    test('with wrong password', async () => {
      const newUser = {
        username: '1',
        password: '1',
        name: 'aalto',
      };
      await api.post('/api/users').send(newUser).expect(400);

      delete newUser.password;
      await api.post('/api/users').send(newUser).expect(400);
    });
  });
  test('with duplicate username', async () => {
    const existedUsers = await userHelper.usersInDB();
    const firstUser = lodash.first(existedUsers);
    await api.post('/api/users').send(firstUser).expect(400);
  });
});
afterAll(() => {
  mongoose.connection.close();
});
