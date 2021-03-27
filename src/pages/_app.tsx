import { AppProps } from 'next/app';
import { Header } from '../components/Header';

import { Provider as NextAuthProvider } from 'next-auth/client';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<NextAuthProvider session={pageProps.session}>
			<Header />
			<Component {...pageProps} />
			<ToastContainer />
		</NextAuthProvider>
	);
}
