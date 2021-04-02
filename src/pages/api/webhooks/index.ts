import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { stripe } from 'services/stripe';
import { Events, EventEmitter } from '../_lib/EventEmitter';
import {
	saveSubscription,
	updateSubscription,
} from '../_lib/consumers/SubscriptionManager';
import { createBufferRequest, middlewareHttpMethods } from '../_lib/utils';

export const config = {
	api: {
		bodyParser: false,
	},
};

const events: Events = {
	'customer.subscription.created': [saveSubscription],
	'customer.subscription.updated': [updateSubscription],
	'customer.subscription.deleted': [updateSubscription],
};

const eventEmitter = EventEmitter.init(events);

export default async (req: NextApiRequest, res: NextApiResponse) => {
	middlewareHttpMethods({
		req,
		res,
		allowMethods: 'POST',
	});

	const buffer = await createBufferRequest(req);

	const secret = req.headers['stripe-signature'];

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			buffer,
			secret,
			process.env.STRIPE_API_KEY_WEBHOOKS
		);
	} catch (error) {
		return res.status(400).send(`Webhook error: ${error.message}`);
	}

	await eventEmitter.emit({
		event: event.type,
		payload: event,
	});

	return res.json({ received: true });
};
