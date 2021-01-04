/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/order
const config = require('../utils/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { body } = request;
  const user = await User.findOne({ username: body.username });
  // eslint-disable-next-line operator-linebreak
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);
  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    config.SECRET,
  );
  return response.status(200).send({
    token,
    id: user._id,
    username: user.username,
    name: user.name,
  });
});

module.exports = loginRouter;
