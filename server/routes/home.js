'use strict';

const express = require('express');
const chalk = require('chalk');
const auth = require('../middleware/auth');
const csv = require('csvtojson');
const path = require('path');
const predict = require('../dataset/knn');
let homeRouter = express.Router();

homeRouter.use((req, res, next) => {
	// supposed to do authentication but what the heck
	next();
});

homeRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/home')));
	// console.log(req.cookies);
	if(req.cookies === undefined || req.cookies['elective'] === undefined) {
		res.redirect('/');
	}
	else if(!auth.authenticate(req.cookies['elective'])) {
		res.redirect('/');
	}
	res.render('home.html');
});

homeRouter.get('/electives', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/home/electives')));
	csv().fromFile(path.join(__dirname, '../dataset/electiveData.csv')).then((data) => {
		let electiveNames = [];
		data.forEach((row) => {
			electiveNames.push(row.Course_name);
		});
		res.json(electiveNames);
	});
});

homeRouter.post('/predict', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/home/predict')));
	let electiveNames = req.body;
	predict(electiveNames, path.join(__dirname, '../dataset/electives.csv'), (results) => {
		res.json(results);
	});
});

homeRouter.get('/recommend', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/home/recommend')));
	res.render('recommend.html');
});

module.exports = homeRouter;