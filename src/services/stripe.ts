import StripeSDK from 'stripe';
import { version, name } from '../../package.json';

class Stripe {
	public static init() {
		const apiSecret = process.env.STRIPE_API_KEY;

		const stripeInstance = new StripeSDK(apiSecret, {
			apiVersion: '2020-08-27',
			appInfo: {
				name,
				version,
			},
		});

		return stripeInstance;
	}
}

export const stripe = Stripe.init();
