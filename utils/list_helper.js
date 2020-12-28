const dummy = (blogs) => 1;
const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const blogMaxLikes = blogs.reduce((max, blog) => {
    if (blog.likes > max.likes) {
      return blog;
    }
    return max;
  }, blogs[0]);
  return {
    title: blogMaxLikes.title,
    author: blogMaxLikes.author,
    likes: blogMaxLikes.likes,
  };
};
module.exports = { dummy, totalLikes, favoriteBlog };
