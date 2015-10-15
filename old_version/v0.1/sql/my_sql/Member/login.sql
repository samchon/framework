CREATE TABLE login
(
	application	VARCHAR(20)	NOT NULL,
	id		VARCHAR(60)	NOT NULL,
	timestamp	TIMESTAMP	NOT NULL,
	ip		CHAR(15)	NOT NULL,
	successFlag	BOOL		NOT NULL,

	PRIMARY KEY(application, id, timestamp)
);