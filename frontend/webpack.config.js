module.exports = (env, argv) => {

	let config;

	switch(argv.mode) {

		case 'development':
			console.log("loading development webpack config...");
			config = require('./webpack/dev.js');
			break;

		case 'production':
			console.log("loading production webpack config...");
			config = require('./webpack/prod.js');
			break;

		default:
			console.error('Unknown build mode '+ argv.mode);
			process.exit();
	}

	return config;
};