import Prismic from '@prismicio/client';

class PrismicClient {
	public static initPrismicInstance(req?: unknown) {
		const prismicApiKey = process.env.PRISMIC_ACCESS_TOKEN;
		const prismicApiUrl = process.env.PRISMIC_END_POINT;

		const prismicInstance = Prismic.client(prismicApiUrl, {
			accessToken: prismicApiKey,
			req,
		});

		return prismicInstance;
	}
}

const getPrismicClient = PrismicClient.initPrismicInstance;

export { getPrismicClient, Prismic };
