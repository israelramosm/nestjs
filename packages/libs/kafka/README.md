# @template/kafka

Módulo NestJS global + productor Kafka basado en `kafkajs` (vía
`@nestjs/microservices`). Es **opt-in**: no está cableado por defecto en la app,
se importa donde se necesite.

## Exports

Subpaths TypeScript (`@template/kafka/<subpath>`):

| Subpath                       | Exporta                                                        |
| ----------------------------- | ------------------------------------------------------------- |
| `kafka.module`                | `KafkaModule` (`@Global`), registra el `ClientKafka`          |
| `kafka.producer.service`      | `KafkaProducerService` (`emit`, `send`)                       |
| `kafka.constants`             | `KAFKA_CLIENT` (token del `ClientKafka`)                      |

`KafkaModule` exporta `ClientsModule` y `KafkaProducerService`. El cliente se
configura de forma asíncrona desde envs y no abre conexión hasta el primer
`connect()` / emisión.

## Uso

Importa el módulo donde lo necesites (por ser `@Global`, basta cablearlo una vez,
p. ej. en `AppModule`):

```ts
import { Module } from '@nestjs/common';
import { KafkaModule } from '@template/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
})
export class AppModule {}
```

Inyecta el productor donde publiques mensajes:

```ts
import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '@template/kafka/kafka.producer.service';

@Injectable()
export class UsersService {
  constructor(private readonly kafka: KafkaProducerService) {}

  created(user: { id: string }) {
    // fire-and-forget (event)
    this.kafka.emit('user.created', user);
  }

  ask(payload: unknown) {
    // request/response, devuelve un Observable con la respuesta
    return this.kafka.send<Result, unknown>('user.query', payload);
  }
}
```

## Configuración (envs)

| Variable          | Descripción                       | Default              |
| ----------------- | --------------------------------- | -------------------- |
| `KAFKA_CLIENT_ID` | `clientId` de kafkajs             | `template`           |
| `KAFKA_BROKERS`   | brokers separados por coma        | `localhost:9092`     |
| `KAFKA_GROUP_ID`  | `groupId` del consumer            | `template-consumer`  |

Levanta Kafka con el profile de docker-compose (`--profile kafka`) desde la raíz.
