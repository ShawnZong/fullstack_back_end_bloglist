const lodash = require('lodash');

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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
