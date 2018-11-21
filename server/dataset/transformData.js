'use strict';

const csv = require('csvtojson');
const jsonToCSV = require('json-to-csv');

// all the various categories
let teachers = [
	['Channa Bankapur & Dr. R. Srinath & Siddhu', 'V. R. Badriprasad', 'H. L. Phalachandra', 'Dr. Jayashree R & Dr. Anant R Kopper', 'N. Anantharaman & Srikanth H. R.', 'D. Krupesha'],
	['Raghu B. A.', 'Srikant M. Prabhu & Dr. Gowri Srinivas', 'Dr. Sudharshan', 'Srikanth M. Prabhu', 'Dr. Nagegowda K. S.', 'Dr. H. B. Prasad & Dr. Alka Agarwal'],
	['Dr. K. V. Subramaniam & Dr. Dinakar Sitaram', 'Dr. S. Natrajan', 'Dr. S. Natarajan', 'N. S. Kumar & Bhakarjyothi Das', 'H. V. Srinivasa Murthy', 'Bhaskarjyothi Das', 'Dr. Jayashree R & Chidambara K'],
	['C. O. Prakash', 'N. Anantharaman', 'Dr. Antony Peria Kumar', 'Dr. Jayashree R', 'N. S. Kumar', 'A. Vinay', 'Dr. H. B. Prasad'],
	['Not Applicable']
];

let specializations = [
	['Algorithms and Computing Models & Data Science', 'Systems and Core Computing & Data Science', 'Algorithms and Computing Models & Systems and Core Computing'],
	['Algorithms and Computing Models & Data Science & Systems and Core Computing'],
	['Algorithms and Computing Models', 'Data Science', 'Systems and Core Computing'],
	['Not Applicable']
];

let prerequisites = [
	['Design and Analysis of algorithms', 'Design and Analysis of Algorithms', 'Dicrete Mathematics and Logic', 'Microprocessor and Computer Architecture'],
	['Computer Networks', 'Web Technologies I', 'Database Management Systems'],
	['Machine Learning', 'Introduction to Data Science'],
	['Not Applicable']
];

csv().fromFile('electiveData.csv').then((data) => {
	// transforming to categorical data
	data.forEach((row) => {
		for (let i = 0; i < teachers.length; i++) {
			if (teachers[i].indexOf(row.Teacher) > -1) {
				row.Teacher = i;
				break;
			}
		}
		for (let i = 0; i < specializations.length; i++) {
			if (specializations[i].indexOf(row.Specialization) > -1) {
				row.Specialization = i;
				break;
			}
		}
		for (let i = 0; i < prerequisites.length; i++) {
			if (prerequisites[i].indexOf(row.Prerequisites) > -1) {
				row.Prerequisites = i;
				break;
			}
		}
	});
	jsonToCSV(data, 'electives.csv').then(() => console.log('Successful!')).catch((err) => console.log(err));
});