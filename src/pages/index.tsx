import { SubscribeButton } from 'components/SubscribeButton';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { stripe } from 'services/stripe';

import styles from './home.module.scss';

interface SSGHomePropsProps {
	product: {
		priceId: string;
		amount: string;
	};
}

const Home: NextPage<SSGHomePropsProps> = ({ product }) => {
	return (
		<>
			<Head>
				<title>Home | ig.news</title>
			</Head>

			<main className={styles.contentContainer}>
				<section className={styles.hero}>
					<span>👏 Hey, welcome</span>
					<h1>
						New about the <span>React</span> world.
					</h1>
					<p>
						Get access to all publications <br />
						<span>for {product.amount} mouth</span>
					</p>
					<SubscribeButton priceId={product.priceId} />
				</section>

				<img src="/images/avatar.svg" alt="image" />
			</main>
		</>
	);
};

export const getStaticProps: GetStaticProps<SSGHomePropsProps> = async () => {
	const price = await stripe.prices.retrieve('price_1IZNkWA8l6J998lLSa2lJ3QF');

	const product = {
		priceId: price.id,
		amount: new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price.unit_amount / 100),
	};

	return {
		props: {
			product,
		},

		revalidate: 60 * 60 * 24, // 24 hours,
	};
};

export default Home;
