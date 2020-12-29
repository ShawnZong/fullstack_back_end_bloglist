const lodash = require('lodash');
const Blog = require('../models/blog');

const dummy = (blogs) => 1;
const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  return lodash.sumBy(blogs, 'likes');
};
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const blogMaxLikes = lodash.maxBy(blogs, 'likes');

  return {
    title: blogMaxLikes.title,
    author: blogMaxLikes.author,
    likes: blogMaxLikes.likes,
  };
};

const mostBlogs = (blogs) => {
  const countBlogsOfAuthorTmp = lodash.reduce(
    blogs,
    (result, blog) => {
      result[blog.author] = (result[blog.author] || 0) + 1;
      return result;
    },
    {},
  );
  const countBlogsOfAuthor = [];
  lodash.forIn(countBlogsOfAuthorTmp, (value, key) => {
    countBlogsOfAuthor.push({ author: key, blogs: value });
  });
  return lodash.maxBy(countBlogsOfAuthor, 'blogs');
};

const mostLikes = (blogs) => {
  const authorWithLikesTmp = lodash.reduce(
    blogs,
    (result, blog) => {
      result[blog.author] = (result[blog.author] || 0) + blog.likes;
      return result;
    },
    {},
  );
  const authorWithLikes = [];
  lodash.forIn(authorWithLikesTmp, (value, key) => {
    authorWithLikes.push({ author: key, likes: value });
  });

  return lodash.maxBy(authorWithLikes, 'likes');
};

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  nonExistingId,
  blogsInDB,
  initialBlogs,
};
