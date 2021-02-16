import { Response } from 'express';
export function InvalidCredentialsResponse(res: Response): void {
	res.setHeader('Error', 'Invalid credentials provided');
	res.writeHead(401, 'Unauthorized');
	res.end();
}

export function BadRequest(res: Response): void {
	res.setHeader('Error', 'Bad Request');
	res.writeHead(400, 'Bad Request');
	res.end();
}

export function UnsupportedMedia(res: Response) {
	res.setHeader('Error', 'Unsupported Media Type');
	res.writeHead(415, 'Unsupported Media Type');
	res.end();
}

export function ErrorResponse(res: Response, status: number, error: string, body?: any) {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Error', error);
	res.status(status);
	res.end(body ? JSON.stringify(body) : '');
}

export function ValidResponse(res: Response, body?: any): void {
	res.setHeader('Content-Type', 'application/json');
	res.status(200);
	res.end(body ? JSON.stringify(body) : '');
}

export function ValidResponseNoContent(res: Response): void {
	res.status(204);
	res.end();
}
