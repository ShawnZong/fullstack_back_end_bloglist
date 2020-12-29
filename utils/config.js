require('dotenv').config();

const { PORT } = process.env;
let { MONGODB_URL } = process.env;
if (process.env.NODE_ENV === 'test') {
  MONGODB_URL = process.env.TEST_MONGODB_URL;
}
const { SECRET } = process.env;
module.exports = {
  PORT,
  MONGODB_URL,
  SECRET,
};
