/* eslint-disable no-console */
const morgan = require('morgan');
morgan.token('req-body', (req) => JSON.stringify(req.body));
const reqDetail = morgan(
  ':method :url :status :res[content-length] - :response-time ms :req-body',
);
const info = (...params) => console.log(...params);
const error = (...params) => console.error(...params);
module.exports = { info, error, reqDetail };
