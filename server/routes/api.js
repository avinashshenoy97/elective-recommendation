'use strict';

const express = require('express');
const chalk = require('chalk');
const auth = require('../middleware/auth');
let apiRouter = express.Router();

apiRouter.post('/auth', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/api/auth')));
	if (req.body.isRegistration) {
		auth.register(req.body.user, req.body.pass, (err, token) => {
			if (err) throw err;
			res.cookie('elective', token, {
				httpOnly: true
			});
			res.json({
				invalid: false
			});
		});
	} else {
		auth.authorize(req.body.user, req.body.pass, (err, token) => {
			if (err) return res.json({
				invalid: true
			});
			res.cookie('elective', token, {
				httpOnly: true
			});
			res.json({
				invalid: false
			});
		});
	}
});

module.exports = apiRouter;