CREATE TABLE component
(
	uid		INT		NOT NULL,
	pid		INT,
	code		CHAR(10)	NOT NULL,
	report		SMALLINT	NOT NULL,
	standard	SMALLINT	NOT NULL,
	name		VARCHAR(100)	NOT NULL,
	level		SMALLINT	NOT NULL,

	PRIMARY KEY(uid, code, report, standard),
	KEY	category(code, report, standard)
);