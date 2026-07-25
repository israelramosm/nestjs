import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

/**
 * Carga el `.env` compartido de esta lib sin depender de mise ni del cwd.
 * El `.env` vive junto a este paquete (packages/libs/configs/envs/.env),
 * un nivel arriba de `src/`. Importar este modulo (idealmente lo primero en
 * el entrypoint de la app) deja las variables en `process.env`.
 *
 * No sobreescribe variables ya presentes en el entorno (dotenv por defecto),
 * asi que en produccion puedes inyectarlas por el runtime/orquestador.
 */
const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

export { envPath };
