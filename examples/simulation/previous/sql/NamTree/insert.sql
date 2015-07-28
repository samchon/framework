INSERT INTO NamTree.file
SELECT 
	fileID, 
	'', #header 
	concat
	(
		'var indexArray:IndexArray = history.getIndexArray(standard, period);\n',
		'x = x - indexT;\n'
		'var index:Index = indexArray[x];\n',
		'\n'
		'return index.', C.field, ';'
	), #getFunction
	'', #composerFunction
	'Number' #returnType
FROM 
	FileTree.file2 F, 
	Index.reportComponent C
WHERE 
	F.extension = 'ntr' AND 
	F.name = C.name;

INSERT INTO NamTree.parameter VALUES (DEFAULT, 'standard', 'int', '1');
INSERT INTO NamTree.parameter VALUES (DEFAULT, 'period', 'int', '4');

INSERT INTO NamTree.fileParameter
SELECT * FROM
(
	SELECT fileID, 1, 5 FROM NamTree.file
	UNION ALL
	SELECT fileID, 2, 6 FROM NamTree.file
) T;

/*
-----------------------------------------------------------------------
	BACK-TESTING
-----------------------------------------------------------------------
*/
#BETWEEN 1150 AND 1186
INSERT INTO FileTree.file2
SELECT 1, 1003, '', 1093, 'test', C.name, 'ntr', NULL, NULL
FROM Index.reportComponent C
WHERE C.pid IS NOT NULL;

INSERT INTO NamTree.file
SELECT 
	fileID, 
	'', #header 
	concat
	(
		'var currentDate:Date = DateUtil.parse( historyArray.getCandleArray().at(x).date );\n',
		'var indexDate:Date;\n',
		'var i:int;\n',
		'\n',
		'for(i = 0; i < indexArray.length; i++)\n',
		'{\n',
		'	indexDate = DateUtil.parse( indexArray.at(i).date );\n',
		'	if( DateUtil.getMonthGap(currentDate, indexDate) < 3 )\n',
		'		break;\n',
		'}\n',
		'\n',
		'i = i - 1 - indexT;\n',
		'if(i < 0)\n',
		'	return NULL;\n',
		'else\n',
		'{\n',
		'	var indexArray:IndexArray = history.getIndexArray(standard, period);\n',
		'	if(indexArray == null)\n',
		'		return NULL;\n',
		'	else\n',
		'		return indexArray.at(i).', C.field, ';'
		'}'
	), #getFunction
	'', #composerFunction
	'Number', #returnType
	NULL #otherside
FROM 
	FileTree.file2 F, 
	Index.reportComponent C
WHERE 
	F.category = 1003 AND
	F.extension = 'ntr' AND 
	F.name = C.name;
UPDATE NamTree.file SET getFunction = replace(getFunction, 'historyArray.getCandleArray()', 'history.getCandleArray()');

UPDATE FileTree.file2 SET parentID = 1108 WHERE fileID BETWEEN 1150 AND 1154;
UPDATE FileTree.file2 SET parentID = 1109 WHERE fileID BETWEEN 1155 AND 1161;
UPDATE FileTree.file2 SET parentID = 1110 WHERE fileID BETWEEN 1162 AND 1170;
UPDATE FileTree.file2 SET parentID = 1111 WHERE fileID BETWEEN 1171 AND 1174;
UPDATE FileTree.file2 SET parentID = 1112 WHERE fileID BETWEEN 1175 AND 1186;

#INDEX_T
INSERT INTO NamTree.fileParameter
SELECT fileID, 1, 59
FROM NamTree.file F
WHERE fileID BETWEEN 1150 AND 1186;

#STANDARD
INSERT INTO NamTree.fileParameter
SELECT fileID, 2, 60
FROM NamTree.file
WHERE fileID BETWEEN 1150 AND 1186;

#PERIOD
INSERT INTO NamTree.fileParameter
SELECT fileID, 3, 61
FROM NamTree.file F
WHERE fileID BETWEEN 1150 AND 1186;

DELETE FROM NamTree.fileParameter WHERE fileID BETWEEN 1150 AND 1186;