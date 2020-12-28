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

  console.log(countBlogsOfAuthor);
  return lodash.maxBy(countBlogsOfAuthor, 'blogs');
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
