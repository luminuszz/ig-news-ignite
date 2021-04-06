import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

// import { Container } from './styles';

interface NavLinkProps extends LinkProps {
	children: React.ReactElement;
	activeClassName: string;
}

export const NavLink: RComponent<NavLinkProps> = ({
	children,
	activeClassName,
	...rest
}) => {
	const { asPath } = useRouter();

	const className = asPath === rest.href ? activeClassName : '';

	return <Link {...rest}>{React.cloneElement(children, { className })}</Link>;
};
