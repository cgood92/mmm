// Imports
var fs = require("fs"),
	glob = require("glob"),
	mkdirp = require('mkdirp'),
	bookInfo = require('./bookInfo');

// Global vars
var header = "Sort (Column optional),Trial,Source,Book,Org-Page #,PDF,PDF Page #,Textual Context (Column optional)";

function readFile(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, function (err, data) {
			if (err) {
				return reject(err);
			}
			return resolve(JSON.parse(data.toString()));
		});
	});
}

function getPageNumber(pdfName, page) {
	// 0 index fix, plus 1st page always blank (not taken into account until here)
	return page + 2;
}

function padNumber(number){
	return ("000000"+number).slice(-4);
}

function makeSortKey(realPdfPageNumber, orgPageNumber, colName, trial, pdfName){
	var pageNumOk = "ok";
	if (!orgPageNumber.match(/^\d+$/)) {
		pageNumOk = "__";
	}
	if (pdfName.match(/\d+/).pop() < 10) {
		pdfName = "0"+pdfName;
	}
	return [pageNumOk, colName, trial, pdfName, padNumber(realPdfPageNumber)].join(':');
}

function getColName(pdfName, realPdfPageNumber, colIndex){
	var { cols = [] } = bookInfo[pdfName];
	var index = cols.findIndex((range) => {
		return (range.page > realPdfPageNumber);
	}) - 1;
	if (index === -2) {
		index = cols.length - 1;
	}
	return cols[index].cols[colIndex + 1] || console.log('No column...', arguments, cols, index);
}

function extractPdfName(filename){
	return filename.split('/').pop().replace('\.json', '');
}

/* 

Types of bracketed texts that exist

[Beaver, April 5, 1875]
[4 lines blank]
[pages7 and 8 are not extant]
[a41187]
[N 310]
[a10124]
[312 311]
[25 0]
[4 middle of page]
[begins pg 8]
[8 middle of page]
[20 verso]
[11 middle of page]
[end RS Bk 1, Bk 2 9]
[12312]
[Book 8]
[I5]
[Bk 4 25 middle of page]
[Random RT 1]

[2nd trial Bk 1]
[Book 1 1]
[Cover of Book 2]
[Bk 4 7 3]

[Trial 2 Bk 1 143 cont.]
[Bk 1 39 cont.]
[232 cont.]

[18]
[2]
[279]
[Bk 5 37 cont.]
[Bk 6 2]
[Bk. 2 217]
[Bk 3 cont. 1]

*/

function extractOrgPageNumber(match) {
	match = match.replace(/I/g, '1');
	var extracted;
	if (match.match(/\[ *\d+[ cont\.]*\]/)) {
		extracted = match.match(/\d+/)[0];
	} else if (match.match(/bk/gi)) {
		var subAfter = match.split(/bk/i).pop();
		var nums = subAfter.match(/\d+/g);
		if (nums && nums.length === 2) {
			extracted = nums[1];
		}
	}
	return normalizeSpace(extracted || "");
}

function normalizeSpace(text) {
	return text.replace(/(\r|\n)/g, '');
}

function extractBookNumber(match, colName, bookMap = {}) {
	match = match.replace(/I/g, '1');
	var isBook = match.match(/bk \d+[ cont\.]*\d+/gi),
		nums = match.split(/bk/i).pop().match(/\d+/g);
	if (isBook && nums && nums.length === 2) {
		return bookMap[colName] = nums[0];
	} else {
		return bookMap[colName];
	}
}

function formatTrialName(trial){
	if (trial === 'trial1'){
		return "Trial 1";
	} else if (trial === 'trial2') {
		return "Trial 2";
	}
}


function generateLines(filename, data){
	var csv = [],
		trial = formatTrialName(filename.split('/')[2]),
		bookMap = {},
		pdfName = extractPdfName(filename);
	data.forEach((page, pageIndex) => {
		var realPdfPageNumber = getPageNumber(pdfName, pageIndex);
		page.data.forEach((table, tableIndex) => {
			table.forEach((col, colIndex) => {
				(col.text.match(/\[([^\]\[]*)\d([^\]\[]*)\]/g) || []).forEach((match) => {
					var orgPageNumber = extractOrgPageNumber(match),
						colName = getColName(pdfName, realPdfPageNumber, colIndex),
						book = extractBookNumber(match, colName, bookMap) || "",
						sort = makeSortKey(realPdfPageNumber, orgPageNumber, colName, trial, pdfName);

					var line = [
						sort, 
						trial, 
						colName, 
						book, 
						orgPageNumber, 
						pdfName, 
						realPdfPageNumber, 
						normalizeSpace(match)
					].map((item) => {
						return `"${item}"`;
					}).join(',');
					csv.push(line);
				});
			});
		});
	});
	return csv;
}

function writeFile(filename, data) {
	return new Promise((resolve, reject) => {
	    var destination = filename.replace("/json/", "/finished/").replace("\.json", ".csv"),
	    	directory = destination.split('/').slice(0, -1).join('/');
	    mkdirp(directory, null, function(direrr) {
		    fs.writeFile(destination, data, function(err) {
		        if(err) {
		            return reject(err);
		        }
		        return resolve();
		    });
	    });
	});
}

function initiateAllPromises(file) {
	return new Promise((resolve, reject) => {
		readFile(file).then((data) => {
			var lines = generateLines(file, data),
				output = [header].concat(lines).join('\n');
			writeFile(file, output).then(() => resolve(lines));
		});
	});
}

// Main -----------------------------------------------------------------
glob("./json/**/*.json", {}, function (er, files) {
	Promise.all(files.map(initiateAllPromises)).then((all) => {
		var lines = [].concat(...all).sort(),
			// -1 becasue of header
			count = lines.length,
			output = [header].concat(lines).join('\n');
		writeFile("./finished/all.csv", output).then(() => {
			console.log('Done!');
			console.log(`${count} page notations found.`);
		});
	}).catch((err) => {
		console.log(err);
	});
});