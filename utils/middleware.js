const morgan = require('morgan');

morgan.token('req-body', (req) => JSON.stringify(req.body));
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :req-body',
);
module.exports = requestLogger;
