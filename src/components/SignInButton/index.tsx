import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import { signIn, useSession, signOut } from 'next-auth/client';

import styles from './styles.module.scss';

interface SignInButtonProps {}

export const SignInButton: RComponent<SignInButtonProps> = () => {
	const [session] = useSession();
	const [loading, setLoading] = useState(false);

	const handleClickSign = async () => signIn('github');

	const handleSignOut = () => signOut();

	return session ? (
		<button
			type="button"
			className={styles.signInButton}
			onClick={handleSignOut}
		>
			<FaGithub color="#04d361" />
			{session.user?.name}
			<FiX color="#737380" className={styles.closeIcon} />
		</button>
	) : (
		<button
			type="button"
			className={styles.signInButton}
			onClick={handleClickSign}
		>
			<FaGithub color="#eba417" />
			{loading ? 'Logando' : 'Sign in with GitHub'}
		</button>
	);
};
