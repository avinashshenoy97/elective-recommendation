'use strict';

const csv = require('csvtojson');
const decisionTree = require('decision-tree');

function predict(electiveNames, filePath, callback) {
	csv().fromFile(filePath).then((data) => {
		let trainingData = data;
		let features = ['1', '2'];
		let classes = ['3', '4'];
		let predictionData = {
			'1': electiveNames[0],
			'2': electiveNames[1]
		};
		if (electiveNames.length > 2) {
			features.push('3', '4');
			classes = ['5', '6'];
			predictionData['3'] = electiveNames[2];
			predictionData['4'] = electiveNames[3];
		}
		let predictedClasses = [];
		classes.forEach((className) => {
			predictedClasses.push(new decisionTree(trainingData, className, features).predict(predictionData));
		});
		console.log(predictedClasses);
		callback(predictedClasses);
	});
}

module.exports = predict;