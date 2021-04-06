import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient, Prismic } from 'services/primisc';
import { RichText } from 'prismic-dom';

type Post = {
	id: string;
	slug: string;
	title: string;
	updatedAt: string;
	excerpt: string;
};

interface Props {
	posts: Post[];
}

import styles from './styles.module.scss';

export default function Posts({ posts }: Props) {
	return (
		<>
			<Head>
				<title>Posts | Ignews</title>
			</Head>

			<main className={styles.container}>
				<div className={styles.posts}>
					{posts.map((post) => (
						<Link href={`/posts/${post.slug}`} key={post.id}>
							<a>
								<time>{post.updatedAt}</time>
								<strong>{post.title}</strong>
								<p>{post.excerpt}</p>
							</a>
						</Link>
					))}
				</div>
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const prismic = getPrismicClient();

	const response = await prismic.query(
		[Prismic.predicates.at('document.type', 'post')],
		{
			fetch: ['post.title', 'post.content'],
			pageSize: 100,
		}
	);

	const posts = response.results.map<Post>((post) => ({
		slug: post.uid,
		title: RichText.asText(post.data.title),
		excerpt:
			post.data.content.find((content) => content.type === 'paragraph')?.text ??
			'',
		updatedAt: new Date(post.last_publication_date).toLocaleDateString(
			'pt-br',
			{
				day: '2-digit',
				month: 'long',
				year: 'numeric',
			}
		),
		id: post.id,
	}));

	return {
		props: {
			posts,
		},
	};
};
