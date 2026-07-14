import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Los certificados (key.pem / cert.pem) NO se versionan (ver .gitignore).
 * Se resuelven relativos a este modulo para que funcionen sin importar el cwd.
 */
const certsDir = __dirname;

const httpsOptions = {
	key: fs.readFileSync(path.join(certsDir, 'key.pem')),
	cert: fs.readFileSync(path.join(certsDir, 'cert.pem')),
};

export default httpsOptions;
