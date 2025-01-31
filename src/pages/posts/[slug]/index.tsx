import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { getSession } from 'next-auth/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from 'services/primisc';

import styles from './styles.module.scss';

type Post = {
	slug: string;
	title: string;
	updatedAt: string;
	content: string;
};

interface Props {
	post: Post;
}

export default function Post({ post }: Props) {
	return (
		<>
			<Head>
				<title>{post.title} | Ignews</title>
			</Head>

			<main className={styles.container}>
				<article className={styles.post}>
					<h1>{post.title}</h1>
					<time>{post.updatedAt}</time>
					<div
						className={styles.postContent}
						dangerouslySetInnerHTML={{ __html: post.content }}
					></div>
				</article>
			</main>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
	req,
	params,
}) => {
	const session = await getSession({ req });

	if (!session?.user.activeSubscription) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const { slug } = params;

	const prismic = getPrismicClient(req);

	const response = await prismic.getByUID('post', String(slug), {});

	const post = {
		slug: String(slug),
		title: RichText.asText(response.data.title),
		content: RichText.asHtml(response.data.content),
		updatedAt: new Date(response.last_publication_date).toLocaleDateString(
			'pt-br',
			{
				day: '2-digit',
				month: 'long',
				year: 'numeric',
			}
		),
	};

	return {
		props: {
			post,
		},
	};
};
