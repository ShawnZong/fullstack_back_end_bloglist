const https = require('https');
const fs = require('fs');
const config = require('./utils/config');
const app = require('./app');
const logger = require('./utils/logger');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};
const server = https.createServer(options, app);
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
