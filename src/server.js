import 'dotenv/config';
import app from './app.js';
import './database/index.js';

const PORT = +process.env.APP_PORT;

app.listen(PORT, () => {
	console.log(`Applicattion is running at port ${PORT}...`);
});
