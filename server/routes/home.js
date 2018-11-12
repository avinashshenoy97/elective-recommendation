'use strict';

const express = require('express');
const chalk = require('chalk');
const auth = require('../middleware/auth');
let homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/home')));
	res.render('home.html');
});

module.exports = homeRouter;