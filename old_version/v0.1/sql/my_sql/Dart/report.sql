CREATE TABLE Dart.report
(
	reportNo	CHAR(14)	PRIMARY KEY,
	category	CHAR(10),
	standard	INT,
	title		VARCHAR(200),
	date		DATE,
	deliveryDate	DATE,
	corporateKey	CHAR(8),

	INDEX corporateKey(corporateKey)
)