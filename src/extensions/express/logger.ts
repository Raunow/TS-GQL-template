import { json, NextFunction, Request, Response, Router } from 'express';

export function logger(...middlewares: Router[]) {
	const router = Router();

	router.use(json(), ({ path, method, headers, body }: Request, res: Response, next: NextFunction) => {
		if (method === 'OPTIONS') return next();
		console.table({
			path,
			method,
			'content-type': headers['content-type'],
		});
		console.log('req body: ', body);

		const defWrite = res.write;
		const defEnd = res.end;
		const chunks: any = [];
		res.write = (...restArgs: any): any => {
			chunks.push(Buffer.from(restArgs[0]));
			defWrite.apply(res, restArgs);
		};
		res.end = (...restArgs: any): any => {
			if (restArgs[0]) chunks.push(Buffer.from(restArgs[0]));
			let body = Buffer.concat(chunks).toString('utf8');

			if (body.length > 2000) body = body.slice(0, 2000) + '[Message Trunkated]';
			console.log('res body: ', body);

			defEnd.apply(res, restArgs);
		};

		next();

		console.log('status: ', res.statusCode, res.statusMessage || '');
	});

	if (middlewares.length !== 0) router.use(...middlewares);

	return router;
}
