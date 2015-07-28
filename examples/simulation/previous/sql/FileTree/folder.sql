CREATE TABLE folder
(
	uid		INT PRIMARY KEY AUTO_INCREMENT,
	pid		INT,
	id		VARCHAR(60),
	application	VARCHAR(60),
	category	VARCHAR(60),
	name		VARCHAR(60),
	comment		TEXT,
	live		SMALLINT NOT NULL DEFAULT 1,

	UNIQUE KEY UNIQUE (pid, name),
	INDEX pid (pid),
	INDEX source (application, category)
);