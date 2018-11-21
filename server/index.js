'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const path = require('path');
const requireDir = require('require-dir');
const auth = require('./middleware/auth');
const routes = requireDir('./routes');

let app = express();
app.set('port', 8080);
app.use(express.static(path.join(__dirname, '../ui/public'))); // css and js
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('views', path.join(__dirname, '../ui/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/')));
	console.log(req.cookies);
	if(req.cookies === undefined || req.cookies['elective'] === undefined) {
		res.render('index.html');
	}
	else if(auth.authenticate(req.cookies['elective'])) {
		res.redirect('/home');
	}
	// res.render('index.html');
});

for (let route in routes)
	app.use('/' + route, routes[route]);

app.get('/logout', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/logout')));
	res.clearCookie('elective');
	res.redirect('/');
});

app.use((req, res, next) => {
	console.log(chalk.yellow('Undefined route: ' + req.method + ' ' + req.originalUrl));
	res.status(404).render('404.html');
});

module.exports = app;