import { Client as FaunaClient } from 'faunadb';

class Fauna {
	public static init() {
		const apiSecret = process.env.FAUNA_DB_API_KEY;

		const faunaInstance = new FaunaClient({
			secret: apiSecret,
		});

		return faunaInstance;
	}
}

export const fauna = Fauna.init();
