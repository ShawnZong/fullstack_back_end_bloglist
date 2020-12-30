const morgan = require('morgan');

morgan.token('req-body', (req) => JSON.stringify(req.body));
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :req-body',
);

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  // console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    // console.log('backend validator', error);
    return response.status(400).send({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  }

  next(error);
};

module.exports = { requestLogger, errorHandler };
