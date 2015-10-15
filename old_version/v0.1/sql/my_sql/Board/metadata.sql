CREATE TABLE metadata
(
	application	SMALLINT,
	category	SMALLINT,
	name		VARCHAR(60),
	comment		TEXT,

	PRIMARY KEY (application, category)
);