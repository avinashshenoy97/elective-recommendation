'use strict';

const knn = require('alike');
const csv = require('csvtojson');

//let electiveNames = ["Advanced Algorithms", "Big Data"];
//predict(electiveNames);

function predict(electiveNames, filePath, callback) {
	csv().fromFile(filePath).then((data) => {
		let electiveTastes = [];
		for (let i = 0; i < data.length; i++) {
			if (electiveNames.indexOf(data[i].Course_name) > -1) {
				electiveTastes.push({
					Teacher: data[i].Teacher,
					Specialization: data[i].Specialization,
					Prerequisites: data[i].Prerequisites
				});
				data.splice(i, 1);
			}
		}
		let electiveTaste = getAverage(electiveTastes);
		console.log(electiveTaste);
		// can put weights too, right now it's equally weighted
		let requiredPredictions = [0, 0];
		let k = 2;
		while(true) {
			let predictions = knn(electiveTaste, data, {
				k: k
			});

			predictions.forEach((p) => {
				if(p['Elective_no'] == 5) {
					if(requiredPredictions[0] == 0) {
						requiredPredictions[0] = p;
					}
				}
				else if(p['Elective_no'] == 6) {
					if(requiredPredictions[1] == 0) {
						requiredPredictions[1] = p;
					}
				}
			});
			// oh well
			if(!(requiredPredictions[0] == 0 || requiredPredictions[1] == 0)) {
				break;
			}
			else {
				k += 1;
			}
		}
		
		callback(requiredPredictions);
	});
}

function getAverage(electiveTastes) {
	let specializationSum = 0,
		teacherSum = 0,
		prerequisiteSum = 0;
	electiveTastes.forEach((element) => {
		specializationSum += element.Specialization;
		teacherSum += element.Teacher;
		prerequisiteSum += element.Prerequisites;
	});
	return {
		Teacher: teacherSum / electiveTastes.length,
		Specialization: specializationSum / electiveTastes.length,
		Prerequisites: prerequisiteSum / electiveTastes.length
	};
}

module.exports = predict;