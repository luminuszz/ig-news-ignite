import React from 'react';
import { SignInButton } from 'components/SignInButton';

import styles from './styles.module.scss';

interface HeaderProps {}

export const Header: RComponent<HeaderProps> = () => {
	return (
		<header className={styles.headerContainer}>
			<div className={styles.headerContent}>
				<img src="/images/logo.svg" alt="ig.news" />

				<nav>
					<a className={styles.active} href="#">
						Home
					</a>
					<a href="#">Posts</a>
				</nav>

				<SignInButton />
			</div>
		</header>
	);
};
