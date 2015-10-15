CREATE TABLE Dart.corporate
(
	corporateKey	CHAR(8)		PRIMARY KEY,
	code		CHAR(8),
	
	engName		VARCHAR(200),
	summaryName	VARCHAR(200),

	market		VARCHAR(40),
	corporateID	CHAR(20),
	licenseID	CHAR(20),
	address		VARCHAR(400),
	homepage	VARCHAR(200),
	irHomepage	VARCHAR(200),

	tel		CHAR(20),
	fax		CHAR(20),
	establishedDate	DATE,
	settlingMonth	INT
);

CREATE TABLE Dart.presidentHistory
(
	corporateKey	CHAR(8),
	name		VARCHAR(20),

	PRIMARY KEY(corporateKey, name)
);
CREATE TABLE Dart.category
(
	corporateKey	CHAR(8),
	name		VARCHAR(20),

	PRIMARY KEY(corporateKey, name)
);
CREATE TABLE Dart.corporateNameHistory
(
	corporateKey	CHAR(8),
	no		INT,
	name		VARCHAR(200),

	PRIMARY KEY(corporateKey, no)
);