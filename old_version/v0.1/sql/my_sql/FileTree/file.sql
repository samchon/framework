CREATE TABLE file
(
	pid		INT,
	name		VARCHAR(60),
	content		TEXT,
	live		SMALLINT NOT NULL DEFAULT 1,

	PRIMARY KEY (pid, name),
	INDEX pid (pid)
);