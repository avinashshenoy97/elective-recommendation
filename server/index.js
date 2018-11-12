'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const path = require('path');

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
	res.render('index.html');
});

module.exports = app;