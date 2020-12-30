/* eslint-disable consistent-return */
const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const config = require('../utils/config');
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: true,
    author: true,
    url: true,
  });
  return response.json(users.map((user) => user.toJSON()));
});
userRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', {
    title: true,
    author: true,
    url: true,
  });
  return response.json(user.toJSON());
});

userRouter.post('/', async (request, response) => {
  const userTmp = request.body;
  if (userTmp.password === undefined) {
    return response.status(400).json({ error: 'password mising' });
  }
  if (userTmp.password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' });
  }
  userTmp.password = await bcrypt.hash(userTmp.password, config.saltRounds);

  const user = new User(userTmp);
  const savedUser = await user.save();
  response.status(201).json(savedUser.toJSON());
});
module.exports = userRouter;
