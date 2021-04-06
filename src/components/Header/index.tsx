import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { SignInButton } from 'components/SignInButton';

import styles from './styles.module.scss';
import { NavLink } from './NavLink';

interface HeaderProps {}

type NavLink = {
	name: string;
	url: string;
	hasPreFetch: boolean;
};

const links: NavLink[] = [
	{
		name: 'Home',
		url: '/',
		hasPreFetch: false,
	},
	{
		name: 'Posts',
		url: '/posts',
		hasPreFetch: true,
	},
];

export const Header: RComponent<HeaderProps> = () => {
	return (
		<header className={styles.headerContainer}>
			<div className={styles.headerContent}>
				<Link href="/">
					<img src="/images/logo.svg" alt="ig.news" />
				</Link>

				<nav>
					{links.map((link) => (
						<NavLink
							activeClassName={styles.active}
							href={link.url}
							key={`${link.name}#${link.url}${Math.random()}`}
							prefetch={link.hasPreFetch}
						>
							<a className={styles.active}>{link.name}</a>
						</NavLink>
					))}
				</nav>

				<SignInButton />
			</div>
		</header>
	);
};
