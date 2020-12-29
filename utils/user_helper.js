const User = require('../models/user');

const initialUsers = [
  {
    username: '111',
    password: '111',
    name: '111',
  },
  {
    username: '222',
    password: '222',
    name: '222',
  },
];
const usersInDB = async () => {
  const users = await User.find({});
  return users.map((tmp) => tmp.toJSON());
};
module.exports = { initialUsers, usersInDB };
