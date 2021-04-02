import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from 'services/stripe';
import { query as q } from 'faunadb';
import { getSession } from 'next-auth/client';
import { fauna } from 'services/faunadb';
import { middlewareHttpMethods } from '../_lib/utils';

type User = {
	ref: {
		id: string;
	};
	data: {
		email: string;
		stripe_costumer_id?: string;
	};
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	middlewareHttpMethods({
		req,
		res,
		allowMethods: ['POST'],
	});

	const { user: loggedUser } = await getSession({
		req,
	});

	let stripeCostumerId: string;

	const user = await fauna.query<User>(
		q.Get(q.Match(q.Index('user_by_email'), q.Casefold(loggedUser.email)))
	);

	if (user.data.stripe_costumer_id) {
		stripeCostumerId = user.data.stripe_costumer_id;
	} else {
		const stripeCostumer = await stripe.customers.create({
			email: loggedUser.email,
		});

		stripeCostumerId = stripeCostumer.id;

		await fauna.query(
			q.Update(q.Ref(q.Collection('users'), user.ref.id), {
				data: {
					stripe_customer_id: stripeCostumerId,
				},
			})
		);
	}

	const stripeCheckout = await stripe.checkout.sessions.create({
		customer: stripeCostumerId,
		payment_method_types: ['card'],
		// billing_address_collection: 'required',
		line_items: [
			{
				price: 'price_1IZNkWA8l6J998lLSa2lJ3QF',
				quantity: 1,
			},
		],
		mode: 'subscription',
		allow_promotion_codes: true,

		success_url: process.env.SUCCESS_URL,
		cancel_url: process.env.CANCEL_URL,
	});

	return res.status(200).json({
		sessionId: stripeCheckout.id,
	});
};
