import * as fs from 'node:fs';
import * as path from 'node:path';

/** Opciones TLS que consume NestFactory (subset de https.ServerOptions). */
export interface HttpsOptions {
	key: Buffer;
	cert: Buffer;
}

/**
 * Los certificados (key.pem / cert.pem) NO se versionan (ver .gitignore).
 * Se resuelven relativos a este modulo para que funcionen sin importar el cwd.
 *
 * HTTPS es OPCIONAL: la app arranca en HTTP a menos que existan ambos certs
 * y `HTTPS_ENABLED` no este en "false". Asi el template bootea tras clonar
 * sin pasos manuales, y puedes activar TLS cuando lo necesites.
 */
const certsDir = __dirname;
const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

export function getHttpsOptions(): HttpsOptions | undefined {
	if (process.env.HTTPS_ENABLED === 'false') {
		return undefined;
	}

	if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
		return undefined;
	}

	return {
		key: fs.readFileSync(keyPath),
		cert: fs.readFileSync(certPath),
	};
}

export default getHttpsOptions;
