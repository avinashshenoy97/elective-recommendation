'use strict';

const express = require('express');
const chalk = require('chalk');
const auth = require('../middleware/auth');
let homeRouter = express.Router();

homeRouter.use((req, res, next) => {
	// supposed to do authentication but what the heck
	next();
});

homeRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/home')));
	res.render('home.html');
});

module.exports = homeRouter;