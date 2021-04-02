import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'node:stream';

export async function createBufferRequest(readable: Readable) {
	const chunks = [];

	for await (const chunk of readable) {
		chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
	}

	return Buffer.concat(chunks);
}

interface middlewareHttpMethodsArgs {
	allowMethods: string | string[];
	req: NextApiRequest;
	res: NextApiResponse;
}

export async function middlewareHttpMethods({
	allowMethods,
	req,
	res,
}: middlewareHttpMethodsArgs) {
	const { method } = req;

	const parserArrayMethod = (): Boolean => allowMethods.includes(method);

	const parseStringMethod = (): Boolean => allowMethods === method;

	const isValidMethod = Array.isArray(allowMethods)
		? parserArrayMethod()
		: parseStringMethod();

	if (!isValidMethod) {
		return res.status(405).setHeader('Allow', '');
	}
}
