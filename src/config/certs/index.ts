import * as fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('./src/config/certs/key.pem'),
  cert: fs.readFileSync('./src/config/certs/cert.pem'),
};

export default httpsOptions;
