CREATE TABLE NamTree.file
(
	fileID INT PRIMARY KEY,
	header TEXT,
	getFunction TEXT,
	composerFunction TEXT,
	returnType VARCHAR(100)
);

CREATE TABLE NamTree.parameter
(
	parameterID INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100),
	type VARCHAR(100),
	initialValue VARCHAR(100)
);
CREATE TABLE NamTree.parameterDetermined
(
	parameterID INT,
	no INT,
	label VARCHAR(100),
	data VARCHAR(100),

	PRIMARY KEY(parameterID, no)
);


CREATE TABLE NamTree.dataParameter
(
	application INT,
	category INT,
	no INT,
	parameterID INT,

	PRIMARY KEY PK(application, category, no),
	UNIQUE UK(parameterID)
);
CREATE TABLE NamTree.indexParameter
(
	application INT,
	category INT,
	no INT,
	parameterID INT,

	PRIMARY KEY PK(application, category, no),
	UNIQUE UK(parameterID)
);
CREATE TABLE NamTree.commonParameter
(
	application INT,
	category INT,
	no INT,
	parameterID INT,

	PRIMARY KEY PK(application, category, no),
	UNIQUE UK(parameterID)
);
CREATE TABLE NamTree.fileParameter
(
	fileID INT,
	no INT,
	parameterID INT,

	PRIMARY KEY PK(fileID, no),
	UNIQUE UK(parameterID)
);