require('dotenv').config();

export const ENV = {
	CONNECTION_STRING: process.env.CONNECTION_STRING!,
	API: {
		BRANCH: process.env.BRANCH || 'dev',
		VERSION: process.env.VERSION || '1.0.0',
		PORT: +process.env.PORT! || 4000,
	},
	LOGGING: process.env.LOGGING == 'true' ?? true,
};
