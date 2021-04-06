import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { getSession, useSession } from 'next-auth/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient, Prismic } from 'services/primisc';

import styles from './styles.module.scss';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type Post = {
	slug: string;
	title: string;
	updatedAt: string;
	content: string;
};

interface Props {
	post: Post;
}

export default function PostPreview({ post }: Props) {
	const [session] = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session?.user.activeSubscription) {
			router.push(`/posts/${post.slug}`);
		}
	}, [session]);

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
						className={`${styles.postContent} ${styles.previewContent}`}
						dangerouslySetInnerHTML={{ __html: post.content }}
					></div>

					<div className={styles.continueReading}>
						Wanna continue reading ?
						<Link href="/">
							<a>Subscribe now</a>
						</Link>
					</div>
				</article>
			</main>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const prismic = getPrismicClient();

	const response = await prismic.query(
		[Prismic.predicates.at('document.type', 'post')],
		{
			fetch: ['post.title', 'post.content'],
			pageSize: 100,
		}
	);

	const paths = response.results.map((post) => ({
		params: { slug: post.slugs[0] },
	}));

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const { slug } = params;

	const prismic = getPrismicClient();

	const response = await prismic.getByUID('post', String(slug), {});

	const post = {
		slug: String(slug),
		title: RichText.asText(response.data.title),
		content: RichText.asHtml(response.data.content.splice(0, 3)),
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
		revalidate: 60 * 30, // 30 minutes
	};
};
