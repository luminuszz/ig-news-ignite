import { Readable } from 'node:stream';

export type Events = Record<string, Function[]>;

interface DispatchEvents<T = any> {
	payload: any;

	event: keyof T;
}

export class EventEmitter {
	private events: Events;

	private eventsName: Set<string>;

	private errors = new Set();

	static init(initEvents: Events) {
		return new EventEmitter(initEvents);
	}

	constructor(events: Events) {
		this.events = events;
		this.eventsName = new Set(Object.keys(this.events));
	}

	public async emit({ event, payload }: DispatchEvents<Events>) {
		if (this.eventsName.has(event)) {
			const consumers = this.events[event];

			console.log(`os consumidores dp evento ${event} foram chamados`);

			for (const consumer of consumers) {
				try {
					await consumer(payload);

					console.log(
						`consumidor "${consumer.name}"  do evento "${event}" formadofoi iniciado `
					);
				} catch (e) {
					this.errors.add({
						message: e,
						consumer: consumer.name,
					});
				}
			}

			if (this.errors.size) {
				this.errors.forEach((e: any) => {
					throw new Error(`Error in ${e.consumer} : ${JSON.stringify(e)}`);
				});
			}
		}
	}

	public subscribeEvent(event: string) {
		this.eventsName.add(event);
	}
}
