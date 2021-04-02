import { query as q } from 'faunadb';
import { fauna } from 'services/faunadb';
import { stripe } from 'services/stripe';
import Stripe from 'stripe';

export async function saveSubscription(event: Stripe.Event) {
	const { id: subscriptionId, customer } = event.data
		.object as Stripe.Subscription;

	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	const userRef = await fauna.query(
		q.Select(
			'ref',
			q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customer))
		)
	);

	const subscriptionData = {
		id: subscription.id,
		userId: userRef,
		status: subscription.status,
		price: subscription.items.data[0].price.id,
	};

	await fauna.query(
		q.Create(q.Collection('subscriptions'), {
			data: subscriptionData,
		})
	);
}

export async function updateSubscription(event: Stripe.Event) {
	const { customer, id: subscriptionId } = event.data
		.object as Stripe.Subscription;

	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	const userRef = await fauna.query(
		q.Select(
			'ref',
			q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customer))
		)
	);

	const subscriptionData = {
		id: subscriptionId,
		userId: userRef,
		status: subscription.status,
		price: subscription.items.data[0].price.id,
	};

	await fauna.query(
		q.Replace(
			q.Select(
				'ref',
				q.Get(q.Match(q.Index('subscription_by_id'), subscriptionId))
			),
			{ data: subscriptionData }
		)
	);
}
