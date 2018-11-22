'use strict';

const express = require('express');
const chalk = require('chalk');
const auth = require('../middleware/auth');
const csv = require('csvtojson');
const path = require('path');
const predict = require('../dataset/dt');
let homeRouter = express.Router();

homeRouter.use((req, res, next) => {
	// supposed to do authentication but what the heck
	if (req.cookies === undefined || req.cookies['elective'] === undefined) {
		res.redirect('/');
	} else if (!auth.authenticate(req.cookies['elective'])) {
		res.redirect('/');
	}
	next();
});

homeRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/home')));
	res.render('home.html');
});

homeRouter.get('/electives', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/home/electives?semester=' + req.query.semester)));
	csv().fromFile(path.join(__dirname, '../dataset/electiveData.csv')).then((data) => {
		let electiveNames = [];
		let check = false;
		if(req.query.semester !== undefined) {
			check = req.query.semester;
		}
		console.log(check)
		console.log(electiveNames)
		if(check) {
			data.forEach((row) => {
				if(row.Elective_no == check) {
					electiveNames.push(row.Course_name);
				}
			});
		}
		else {
			data.forEach((row) => {
				electiveNames.push(row.Course_name);
			});
		}
		console.log(electiveNames)
		res.json({semester: check, list: electiveNames});
	});
});

homeRouter.post('/predict', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/home/predict')));
	let electiveNames = [];
	req.body.forEach((elective) => {
		electiveNames.push(elective.split(' ').map(electiveWord => electiveWord[0]).join(''));
	});
	predict(electiveNames, path.join(__dirname, '../dataset/data.csv'), (predictedClasses) => {
		csv().fromFile(path.join(__dirname, '../dataset/electiveData.csv')).then((data) => {
			let results = [];
			for (let i = 0; i < data.length; i++) {
				let abbreviatedForm = data[i].Course_name.split(' ').map(word => word[0]).join('');
				if (abbreviatedForm == predictedClasses[0]) results.push(data[i]);
				else if (abbreviatedForm == predictedClasses[1]) results.push(data[i]);
				if (results.length == 2) break;
			}
			console.log(results);
			res.json(results);
		});
	});
});

homeRouter.get('/recommend', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/home/recommend')));
	res.render('recommend.html');
});

module.exports = homeRouter;