'use strict';

const jwt = require('jwt-simple');
const crypto = require('crypto');
const secret = 'xxxelectivexxx';
const chalk = require('chalk');

// temporary storage until db connection is made
let users = [];

function register(username, password, callback) {
	let newUser = {
		username: username,
		password: generatePassword(password)
	};
	console.log(chalk.yellow('Added user: ' + newUser.username));
	users.push(newUser);
	authorize(username, password, callback);
}

function authenticate(username, password) {
	// authentication middleware by checking token
}

function authorize(username, password, callback) {
	// i cannot believe i'm writing code like this
	let found = false,
		i = 0;
	for (i = 0; i < users.length; i++) {
		if (users[i].username == username) {
			let saltKey = users[i].password.split('+');
			if (matchPassword(password, saltKey[0], saltKey[1])) found = true;
			break;
		}
	}
	if (!found) return callback(new Error('username or password incorrect'), null);
	callback(null, generateToken(users[i].username, users[i].password));
}

function matchPassword(plaintext, salt, key) {
	let derivedKey = crypto.pbkdf2Sync(plaintext, salt, 10000, 32, 'sha512').toString('hex');
	return key == derivedKey;
}

function generatePassword(plaintext) {
	let salt = crypto.randomBytes(10).toString('hex');
	let key = crypto.pbkdf2Sync(plaintext, salt, 10000, 32, 'sha512').toString('hex');
	return salt + '+' + key;
}

function generateToken(username, password) {
	return jwt.encode({
		username: username,
		password: password
	}, secret);
}

module.exports = {
	register: register,
	authorize: authorize,
	authenticate: authenticate
}