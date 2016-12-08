// IMPORTS
var should = require('should'),
	fs = require("fs"),
	glob = require("glob"),
	bookInfo = require("../bookInfo");

var readFile = function(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, function (err, data) {
			if (err) {
				return reject();
			}
			// File format: SORT,Trial,Source (col),Book,Org-Page,PDF,Page,Word Document Source
			resolve(data.toString());
		});
	});
};

var checks = [{
	pdf: '0-Preliminary-Material.pdf',
	pdfPage: 14,
	orgPage: 10,
	source: 'RS'
},{
	pdf: '1-Examination-of-Jurors.pdf',
	pdfPage: 2,
	orgPage: 2,
	source: 'RS'
},{
	pdf: '1-Examination-of-Jurors.pdf',
	pdfPage: 2,
	orgPage: 1,
	source: 'PS'
},{
	pdf: '1-Examination-of-Jurors.pdf',
	pdfPage: 187,
	orgPage: 22,
	source: 'RS'
},{
	pdf: '1-Examination-of-Jurors.pdf',
	pdfPage: 193,
	orgPage: 4,
	source: 'PS'
},{
	pdf: '1-Examination-of-Jurors.pdf',
	pdfPage: 254,
	orgPage: 36,
	source: 'RS'
},{
	pdf: '2-William-Carey-Opening-Statement.pdf',
	pdfPage: 34,
	orgPage: 22,
	source: 'PS'
},{
	pdf: '3-Keyes-and-Bennett-Testimonies.pdf',
	pdfPage: 32,
	orgPage: 18,
	source: 'RS'
},{
	pdf: '4-Philip-Klingensmith-Testimony.pdf',
	pdfPage: 222,
	orgPage: 27,
	source: 'Random RT'
},{
	pdf: '4-Philip-Klingensmith-Testimony.pdf',
	pdfPage: 222,
	orgPage: 31,
	source: 'PS'
},{
	pdf: '5-Joel-White-Testimony.pdf',
	pdfPage: 82,
	orgPage: 8,
	source: 'BT'
},{
	pdf: '6-Annie-Hoge-Testimony.pdf',
	pdfPage: 22,
	orgPage: 30,
	source: 'BT'
},{
	pdf: '7-Willis-Willis-Matthews-and-Young-Testimonies.pdf',
	pdfPage: 129,
	orgPage: 36,
	source: 'RS'
},{
	pdf: '8-Pollock-and-Sherrett-Testimonies.pdf',
	pdfPage: 52,
	orgPage: 5,
	source: 'RS'
},{
	pdf: '9-Bradshaw-and-Kershaw-Testimonies.pdf',
	pdfPage: 60,
	orgPage: 266,
	source: 'RT'
},{
	pdf: '10-Matthews-Pearce-Thompson-Macfarlane-King-Riddle-and-Roberts-Testimonies-and-Young-and-Smith-Motions.pdf',
	pdfPage: 83,
	orgPage: 3,
	source: 'PS'
},{
	pdf: '11-Wells-Spicer-Opening-Statement.pdf',
	pdfPage: 123,
	orgPage: 36,
	source: 'RS'
},{
	pdf: '12-Pollock-and-Young-Testimonies.pdf',
	pdfPage: 43,
	orgPage: 327,
	source: 'RT'
},{
	pdf: '13-Smith-and-Smith-Testimonies.pdf',
	pdfPage: 75,
	orgPage: 41,
	source: 'RS'
},{
	pdf: '14-Elisha-Hoops-Testimony.pdf',
	pdfPage: 42,
	orgPage: 258,
	source: 'BT'
},{
	pdf: '15-Philo-T-Farnsworth-Testimony.pdf',
	pdfPage: 79,
	orgPage: 36,
	source: 'RS'
},{
	pdf: '16-Hamilton-Hamilton-Robinson-Jackson-and-Macfarlane-Testimonies.pdf',
	pdfPage: 52,
	orgPage: 486,
	source: 'RT'
},{
	pdf: '17-Discussion-on-Instructions-and-Boreman-Charge-to-Jury.pdf',
	pdfPage: 53,
	orgPage: 18,
	source: 'RS'
},{
	pdf: '18-William-Carey-Closing-Argument.pdf',
	pdfPage: 37,
	orgPage: 9,
	source: 'BT'
},{
	pdf: '19-Jabez-Sutherland-Closing-Argument.pdf',
	pdfPage: 121,
	orgPage: 35,
	source: 'PS'
},{
	pdf: '20-Enos-D-Hoge-Closing-Argument.pdf',
	pdfPage: 60,
	orgPage: 13,
	source: 'RT'
},{
	pdf: '21-William-W-Bishop-Closing-Argument.pdf',
	pdfPage: 261,
	orgPage: 40,
	source: 'PS'
},{
	pdf: '22-Robert-N-Baskin-Closing-Argument.pdf',
	pdfPage: 157,
	orgPage: 8,
	source: 'RS'
},{
	pdf: '0-Preliminary-Material-and-Wells-Morrill-and-Haslam-Testimonies.pdf',
	pdfPage: 6,
	orgPage: 1,
	source: 'PS'
},{
	pdf: '1-White-Knight-and-McMurdy-Testimonies.pdf',
	pdfPage: 37,
	orgPage: 27,
	source: 'BT'
},{
	pdf: '2-Nephi-Johnson-Testimony.pdf',
	pdfPage: 40,
	orgPage: 57,
	source: 'BT'
},{
	pdf: '3-Hamblin-and-Johnson-Testimonies.pdf',
	pdfPage: 53,
	orgPage: 130,
	source: 'RT'
},{
	pdf: '4-Discussion-of-Utah-Law.pdf',
	pdfPage: 12,
	orgPage: 39,
	source: 'PS'
},{
	pdf: '5-RT-and-MU-Summaries-of-Trial-End.pdf',
	pdfPage: 2,
	orgPage: 143,
	source: 'RT'
},{
	pdf: '6-Denney-and-Foster-Closing-Arguments.pdf',
	pdfPage: 59,
	orgPage: 30,
	source: 'PS'
},{
	pdf: '8-Bishop-and-Howard-Closing-Arguments.pdf',
	pdfPage: 41,
	orgPage: 29,
	source: 'PS'
},{
	pdf: '9-Boreman-Charge-to-Jury.pdf',
	pdfPage: 12,
	orgPage: 13,
	source: 'CCF'
},{
	pdf: '10-John-D-Lee-Death-Sentence.pdf',
	pdfPage: 5,
	orgPage: 4,
	source: 'BOREMAN'
},{
	pdf: '10-John-D-Lee-Death-Sentence.pdf',
	pdfPage: 7,
	orgPage: 6,
	source: 'BOREMAN'
},{
	pdf: '5-RT-and-MU-Summaries-of-Trial-End.pdf',
	pdfPage: 2,
	orgPage: 143,
	source: 'RT'
},{
	pdf: '0-Preliminary-Material-and-Wells-Morrill-and-Haslam-Testimonies.pdf',
	pdfPage: 12,
	orgPage: 2,
	source: 'PS'
}];

readFile('./finished/all.csv').then((data) => {
	describe('Testing to see if all [page #\'s] have been found', function() {
		checks.map((check, index) => {
			var { source, orgPage, pdf, pdfPage } = check;
			var line = [source, '\\d*', orgPage, pdf, pdfPage]
				.map((item) => {
					return `"${item}"`;
				})
				.join(',');
			var match = data.match(line);
			return it (`${index}. Checking for the line --${line}-- in all.csv`, () => {
				return should(match).not.equal(null);;
			});
		});
	});
});

describe('Testing to see if all the pages were analyzed', function() {
	glob.sync('./json/**/*.json').map((filename) => {
		var pdfname = filename.split('/').pop().replace('\.json', ''),
			{ pages } = bookInfo[pdfname];
		return it (`Looking at pages in ${pdfname}`, () => {
			// The first page will always be junk
			var actual = JSON.parse(fs.readFileSync(filename).toString()).length + 1;
			return should(actual).equal(pages);
		});
	});
});

describe('Testing to see if columns match with what is expected', function() {
	glob.sync('./json/**/*.json').map((filename) => {
		var pdfname = filename.split('/').pop().replace('\.json', ''),
			{ cols } = bookInfo[pdfname];
		return describe (`Looking at columns in ${pdfname}`, () => {
			var file = JSON.parse(fs.readFileSync(filename).toString());
			file.forEach((page, pageIndex) => {
				pageIndex += 2;
				var keyIndex = cols.findIndex((item) => {
					return (item.page > pageIndex);
				}) - 1;
				if (keyIndex < 0) {
					keyIndex = cols.length - 1;
				}
				var expected = Object.keys(cols[keyIndex].cols).length;
				page.data.forEach((table) => {
					var actual = table.length;
					var hintText = table.map((col) => col.text || '').join('').replace(/(\n|\r)/g).substring(0, 150);
					return it (`${pdfname} page #${pageIndex}`, () => {
						return should(actual).equal(expected, `Surrounding text: ${hintText}`);
					});
				});
			})
		});
	});
});
