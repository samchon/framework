CREATE TABLE FileTree.option
(
	pid		INT,
	name		VARCHAR(60),
	content		TEXT,

	PRIMARY KEY (pid, name),
	INDEX pid (pid)
);