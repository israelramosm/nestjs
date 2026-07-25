import { Inject, Injectable } from '@nestjs/common';
import type { ClientKafka } from '@nestjs/microservices';
import type { Observable } from 'rxjs';
import { KAFKA_CLIENT } from '#src/kafka.constants';

@Injectable()
export class KafkaProducerService {
	constructor(@Inject(KAFKA_CLIENT) private readonly client: ClientKafka) {}

	emit<T>(topic: string, message: T): Observable<unknown> {
		return this.client.emit(topic, message as object);
	}

	send<TResult, TInput>(topic: string, message: TInput): Observable<TResult> {
		return this.client.send<TResult, TInput>(topic, message);
	}
}
