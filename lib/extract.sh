#!/bin/bash
for f in src/pdf/trial*/*.pdf; do
	echo "$f"
    java -jar ./tabular.jar -o $f.json -f JSON -p all --spreadsheet $f
done