import React from 'react';
import { signIn, useSession } from 'next-auth/client';
import { getStripeJs } from 'services/stripeClient';
import { useToast } from 'hooks/useToast';

import styles from './styles.module.scss';
import { api } from 'services/api';

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

	const handleSubscribe = async () => {
		if (!session) {
			signIn('github');

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
