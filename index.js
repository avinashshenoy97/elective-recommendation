'use strict';

const server = require('./server');
const chalk = require('chalk');

server.listen(server.get('port'), function(err) {
	if (err) throw err;
	console.log(chalk.yellow('Server running on localhost:' + server.get('port')));
});