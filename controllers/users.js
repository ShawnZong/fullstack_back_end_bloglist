const userRouter = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

userRouter.get('/', async (request, response) => {
  const users = await User.find({});
  return response.json(users.map((user) => user.toJSON()));
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
  const saltRounds = 10;
  userTmp.password = await bcrypt.hash(userTmp.password, saltRounds);

  const user = new User(userTmp);
  const savedUser = await user.save();
  response.status(201).json(savedUser.toJSON());
});
module.exports = userRouter;
