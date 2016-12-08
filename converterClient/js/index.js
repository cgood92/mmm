'use strict';

document.addEventListener("DOMContentLoaded", function () {
    (function () {
        // Options ------------------------------------------------------------------
        var levelNames = ['Trial', 'Source', 'Book'];
        var pdfBasePath = 'http://stage.mountainmeadowsmassacre.com/wp-content/transcripts';
        var transcriptMap = {
            "Trial 1": {
                "RS": {
                    "1": {
                        "1": "0-Preliminary-Material.pdf#page=1",
                        "5": "0-Preliminary-Material.pdf#page=3",
                        "6": "0-Preliminary-Material.pdf#page=4",
                        "7": "0-Preliminary-Material.pdf#page=5",
                        "8": "0-Preliminary-Material.pdf#page=8",
                        "9": "0-Preliminary-Material.pdf#page=11",
                        "10": "0-Preliminary-Material.pdf#page=14",
                        "11": "0-Preliminary-Material.pdf#page=17",
                        "12": "0-Preliminary-Material.pdf#page=22",
                        "13": "0-Preliminary-Material.pdf#page=23",
                        "14": "0-Preliminary-Material.pdf#page=25",
                        "15": "0-Preliminary-Material.pdf#page=26",
                        "16": "0-Preliminary-Material.pdf#page=27",
                        "17": "0-Preliminary-Material.pdf#page=29"
                    }
                }
            }
        };

        var pageMap = {
            '1': "/trial1/0-Preliminary-Material.pdf",
            '32': "/trial1/1-Examination-of-Jurors.pdf",
            '288': "/trial1/2-William-Carey-Opening-Statement.pdf",
            '344': "/trial1/3-Keyes-and-Bennett-Testimonies.pdf",
            '376': "/trial1/4-Philip-Klingensmith-Testimony.pdf",
            '770': "/trial1/5-Joel-White-Testimony.pdf",
            '923': "/trial1/6-Annie-Hoge-Testimony.pdf",
            '947': "/trial1/7-Willis-Willis-Matthews-and-Young-Testimonies.pdf",
            '1076': "/trial1/8-Pollock-and-Sherrett-Testimonies.pdf",
            '1152': "/trial1/9-Bradshaw-and-Kershaw-Testimonies.pdf",
            '1245': "/trial1/10-Matthews-Pearce-Thompson-Macfarlane-King-Riddle-and-Roberts-Testimonies-and-Young-and-Smith-Motions.pdf",
            '1383': "/trial1/11-Wells-Spicer-Opening-Statement.pdf",
            '1582': "/trial1/12-Pollock-and-Young-Testimonies.pdf",
            '1702': "/trial1/13-Smith-and-Smith-Testimonies.pdf",
            '1801': "/trial1/14-Elisha-Hoops-Testimony.pdf",
            '1892': "/trial1/15-Philo-T.-Farnsworth-Testimony.pdf",
            '2064': "/trial1/16-Hamilton-Hamilton-Robinson-Jackson-and-Macfarlane-Testimonies.pdf",
            '2163': "/trial1/17-Discussion-on-Instructions-and-Boreman-Charge-to-Jury.pdf",
            '2234': "/trial1/18-William-Carey-Closing-Argument.pdf",
            '2271': "/trial1/19-Jabez-Sutherland-Closing-Argument.pdf",
            '2504': "/trial1/20-Enos-D.-Hoge-Closing-Argument.pdf",
            '2602': "/trial1/21-William-W.-Bishop-Closing-Argument.pdf",
            '2974': "/trial1/22-Robert-N.-Baskin-Closing-Argument.pdf",
            '3399': "/trial2/0-Preliminary-Material-and-Wells-Morrill-and-Haslam-Testimonies.pdf",
            '3467': "/trial2/1-White-Knight-and-McMurdy-Testimonies.pdf",
            '3548': "/trial2/2-Nephi-Johnson-Testimony.pdf",
            '3662': "/trial2/3-Hamblin-and-Johnson-Testimonies.pdf",
            '3769': "/trial2/4-Discussion-of-Utah-Law.pdf",
            '3780': "/trial2/5-RT-and-MU-Summaries-of-Trial-End.pdf",
            '3781': "/trial2/6-Denney-and-Foster-Closing-Arguments.pdf",
            '3863': "/trial2/7-Wells-Spicer-Closing-Argument.pdf",
            '3869': "/trial2/8-Bishop-and-Howard-Closing-Arguments.pdf",
            '3969': "/trial2/9-Boreman-Charge-to-Jury.pdf",
            '3981': "/trial2/10-John-D.-Lee-Death-Sentence.pdf"
        };

        // Functions ---------------------------------------------------------------------
        function sendToPage(page) {
            var path = pdfBasePath + page;
            window.location = path;
        }

        function deep_value(obj, path) {
            for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
                obj = obj[path[i]];
            };
            return obj;
        };

        function prependTrial(path) {
            var trial = path.split('.')[0];
            return '/' + trial.toLowerCase().replace(" ", "") + '/';
        }

        function findDocByPage(page, path) {
            var json = deep_value(transcriptMap, path);
            var destination = getMatrixPageNum(json, page, true);
            destination = prependTrial(path) + destination;
            sendToPage(destination);
        }

        function selectChange(e) {
            // Local functions ------------------------------------------------------------
            function deleteChildren(anchor) {
                var parent = anchor.parentNode;
                var sibling = parent.querySelector('div');
                if (sibling) {
                    parent.removeChild(sibling);
                }
            }

            function createNewSelect(anchor, newPath) {
                var levelName = levelNames[newPath.split('.').length];
                var select = '<select data-path="' + newPath + '">' + ('<option value="">-- Select ' + levelName + ' --</option>') + Object.keys(json).reduce(function (all, key) {
                    return all += '<option value="' + key + '">' + key + '</option>';
                }, '') + '</select>';
                var newSelectDiv = document.createElement('div');
                newSelectDiv.classList.add('inline');
                newSelectDiv.innerHTML = select;
                newSelectDiv.firstChild.addEventListener('change', selectChange);
                anchor.parentNode.appendChild(newSelectDiv);
            }

            function handleError() {
                alert('Sorry, there was an error...');
            }

            function createPageNum(anchor, path) {
                var newTextDiv = document.createElement('div');
                newTextDiv.classList.add('inline');
                newTextDiv.innerHTML = '<input type="text" name="pageNum" id="pageNum" data-path="' + path + '" placeholder="Page #"/>';
                anchor.parentNode.appendChild(newTextDiv);
            }

            // Execution needed ------------------------------------------------------------
            var anchor = e.target,
                path = anchor.dataset.path,
                value = anchor.value;

            // Not default option (ie "-- Select --"), but can be 0
            if (value !== '' && value !== null && value !== undefined) {
                var newPath = (path ? path + '.' : '') + value,
                    json = deep_value(transcriptMap, newPath);

                if (json !== null && json !== undefined) {
                    // Delete HTML children that could have been there...
                    deleteChildren(anchor);

                    // The first 3 columns are the navigation columns
                    if (newPath.split('.').length < 3) {
                        createNewSelect(anchor, newPath);
                    } else {
                        createPageNum(anchor, newPath);
                    }
                }
                // Option for some reason not in JSON map... error handling
                else {
                        handleError();
                    }
            }
        }

        function getMatrixPageNum(map, input) {
            var pageExists = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var pageBreaks = Object.keys(map);

            var target,
                page = 0;

            if (input > 0) {
                for (var i = 0, l = pageBreaks.length; i < l; i++) {
                    var value = parseInt(pageBreaks[i]);
                    if (value > input) {
                        target = parseInt(pageBreaks[i - 1]);
                        page = input - target + 2; // +2 because of 1-based math and +1 cover page
                        break;
                    }
                }

                // If target was never set, set it to the last
                if (!target) {
                    target = pageBreaks[pageBreaks.length - 1];
                }
            } else {
                target = pageBreaks[0];
            }

            var pdf = map[target],
                destination = pdf + (!pageExists ? '#page=' + page : '');

            return destination;
        }

        function generateFirstLevel() {
            var level1 = document.getElementById("level1");
            var options = '<option value="">-- Select ' + levelNames[0] + ' --</option>' + Object.keys(transcriptMap).map(function (elem) {
                return '<option value="' + elem + '">' + elem + '</option>';
            });
            level1.innerHTML = options;
        }

        function init() {
            generateFirstLevel();

            // Multi-level selector menu
            document.getElementById("level1").addEventListener("change", selectChange);

            // Page number matrix
            document.getElementById('matrixPageNum').addEventListener('submit', function (e) {
                var page = getMatrixPageNum(pageMap, parseInt(e.target.elements.namedItem('matrixPage').value));
                sendToPage(page);
                // Prevent form default
                e.preventDefault();
                return false;
            });

            document.getElementById('transcriptionMenu').addEventListener('submit', function (e) {
                var input = e.target.elements.namedItem('pageNum'),
                    page = parseInt(input.value),
                    path = input.dataset.path;

                var destination = findDocByPage(page, path);

                // Prevent form default
                e.preventDefault();
                return false;
            });

            // For the sake of this demo only
            document.getElementById("csv_submit").addEventListener("click", csv_submit);
        }

        init();

        // Demo stuff (delete when going live)  ------------------------------------------------------------------
        // Takes input from Microsoft Excel and converts it to the JSON that we want
        function convertCSVtoJSON(text) {
            // Go through all the rows....
            var json = text.split('\n').reduce(function (acc, elem, index) {
                // Go through all the columns
                var items = elem.split('\t');
                // The last 3 columns are not to be shown in the multi-level list
                var end = items.splice(-2, 2).join('#page=');
                // Go through the rest of the cols
                items.reduce(function (acc2, elem2, index2, array2) {
                    var _ret;

                    // Assuming that this is not the last item in array
                    var ret = (_ret = {}, _ret[elem2] = {}, _ret);
                    // Unless... is it the last item in the array?
                    if (index2 >= array2.length - 1) {
                        var _ret2;

                        // Assign it to be a value (page number), not an object
                        ret = (_ret2 = {}, _ret2[elem2] = end, _ret2);
                    }
                    // If that path does not exist yet, then create it.  Without this check, it would overwrite.
                    if (!acc2[elem2]) {
                        acc2 = Object.assign(acc2, ret);
                    }
                    // Keep acc2 at the end of the path that we're working at
                    return acc2[elem2];
                }, acc);
                // Acc has been modified by references above
                return acc;
            }, {});
            return json;
        }

        // For the sake of this demo only
        function updateUI(mapPassedIn) {
            var level1 = document.getElementById("level1");
            // Replace the level1 select
            var inner = '<option value="">-- Select --</option>' + Object.keys(mapPassedIn).map(function (elem) {
                return '<option value="' + elem + '">' + elem + '</option>';
            }).join('');
            level1.innerHTML = inner;

            // Delete the trail
            var next = level1.nextSibling;
            if (next) {
                next.parentNode.removeChild(next);
            }

            // Update the master map
            transcriptMap = mapPassedIn;
        }

        function csv_submit(e) {
            var csv = document.getElementById("csv");
            // Convert CSV to JSON
            var json = convertCSVtoJSON(csv.value);
            // Replace textarea with json (just to show or to copy)
            csv.value = JSON.stringify(json, null, 4);
            // Update the demo
            updateUI(json);
            // Tell user what happened
            var span = document.createElement('span');
            span.style = 'background-color: #ffff99; padding: .5rem; margin-bottom: .5rem;';
            span.innerHTML = 'You can copy the JSON below and replace the code to use this JSON map.  Also, the demo above has been updated with the information you provided - free of price :)';
            csv.parentNode.insertBefore(span, csv);
        }
    })();
});