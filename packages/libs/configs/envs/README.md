# @template/configs-envs

Lib de configuración de entorno del monorepo: nombres de variables, esquemas de
validación (Joi), carga del `.env` compartido y opciones HTTPS con certs.

## Exports

Gracias al subpath `./*` cada archivo de `src/` se expone como
`@template/configs-envs/<archivo>`.

| Subpath                             | Exporta            | Descripción                                                        |
| ----------------------------------- | ------------------ | ------------------------------------------------------------------ |
| `@template/configs-envs/Environments`   | `Environments`     | Mapa con los nombres de las variables de entorno.                  |
| `@template/configs-envs/config.schemas` | `ConfigSchemas`    | Esquema Joi (`validations`) para validar `process.env`.           |
| `@template/configs-envs/load-env`       | `envPath` (side effect) | Carga el `.env` de la lib en `process.env` al importarlo.    |
| `@template/configs-envs/certs`          | `getHttpsOptions`, `HttpsOptions` | Resuelve `key.pem` / `cert.pem` para TLS opcional. |

## Uso

Importa `load-env` lo primero en el entrypoint de la app para poblar
`process.env` sin depender del `cwd`:

```ts
import '@template/configs-envs/load-env';

import { Environments } from '@template/configs-envs/Environments';
import { ConfigSchemas } from '@template/configs-envs/config.schemas';
import { getHttpsOptions } from '@template/configs-envs/certs';

ConfigModule.forRoot({
  validationSchema: ConfigSchemas.validations,
});

const port = process.env[Environments.PORT];
const httpsOptions = getHttpsOptions();
```

Declara la lib como `"@template/configs-envs": "workspace:*"` en el paquete que
la consume.

## `.env` y certs

- El `.env` vive junto a esta lib (`packages/libs/configs/envs/.env`). Parte de
  `.env.example` y `load-env` lo carga sin sobrescribir variables ya presentes
  en el entorno (útil en producción con el runtime/orquestador).
- HTTPS es opcional: `getHttpsOptions()` devuelve `undefined` si no existen
  ambos certs (`src/certs/key.pem`, `cert.pem`) o si `HTTPS_ENABLED=false`, así
  la app arranca en HTTP sin pasos manuales. Los certs no se versionan.
