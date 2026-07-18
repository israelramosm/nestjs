import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '#src/kafka.constants';
import { KafkaProducerService } from '#src/kafka.producer.service';

/**
 * Modulo global de Kafka. Registra un `ClientKafka` (transport de
 * @nestjs/microservices) configurado desde envs. No abre conexion hasta que
 * se llama `connect()` / se emite el primer mensaje.
 */
@Global()
@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: KAFKA_CLIENT,
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: (config: ConfigService) => ({
					transport: Transport.KAFKA,
					options: {
						client: {
							clientId: config.get<string>('KAFKA_CLIENT_ID') ?? 'template',
							brokers: (config.get<string>('KAFKA_BROKERS') ?? 'localhost:9092').split(','),
						},
						consumer: {
							groupId: config.get<string>('KAFKA_GROUP_ID') ?? 'template-consumer',
						},
					},
				}),
			},
		]),
	],
	providers: [KafkaProducerService],
	exports: [ClientsModule, KafkaProducerService],
})
export class KafkaModule {}
