import React from 'react';
import { signIn, useSession } from 'next-auth/client';
import { getStripeJs } from 'services/stripeClient';
import { useToast } from 'hooks/useToast';

import styles from './styles.module.scss';
import { api } from 'services/api';
import { useRouter } from 'next/router';

interface SubscribeButtonProps {
	priceId: string;
}

type Checkout = {
	sessionId: string;
};

export const SubscribeButton: RComponent<SubscribeButtonProps> = ({
	priceId,
}) => {
	const [session] = useSession();
	const { success, error } = useToast();

	const { push } = useRouter();

	const handleSubscribe = async () => {
		if (!session) {
			signIn('github');

			return;
		}

		if (session.user.activeSubscription) {
			push('/posts');
			return;
		}

		try {
			const response = await api.post<Checkout>('subscribe');

			const { sessionId } = response.data;

			const stripeClient = await getStripeJs();

			await stripeClient.redirectToCheckout({
				sessionId: sessionId,
			});

			success('Pagamento Realizado com sucesso');
		} catch (error) {
			console.log(error);
			//	error(error);
		}
	};

	return (
		<button
			type="button"
			className={styles.subscribeButton}
			onClick={handleSubscribe}
		>
			Subscribe now
		</button>
	);
};
