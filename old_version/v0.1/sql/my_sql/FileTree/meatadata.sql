CREATE TABLE metadata
(
	application	SMALLINT,
	category	SMALLINT,
	extension	VARCHAR(10),
	comment		TEXT,

	PRIMARY KEY (application, category)
);