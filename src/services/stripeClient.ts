import { loadStripe } from '@stripe/stripe-js';

class StripeClient {
	public static async getStripeJsInstance() {
		const stripeApiKey = process.env.NEXT_PUBLIC_STRIPE_API_PUBLIC_KEY;

		const stripeJs = await loadStripe(stripeApiKey);

		return stripeJs;
	}
}

export const getStripeJs = StripeClient.getStripeJsInstance;
