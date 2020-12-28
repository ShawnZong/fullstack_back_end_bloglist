const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const app = express();

// const mongoUrl = 'mongodb://localhost/bloglist'
const mongoUrl = config.MONGODB_URL;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use('/api', blogsRouter);
app.use(logger.reqDetail);

module.exports = app;
