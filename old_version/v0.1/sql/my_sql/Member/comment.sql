CREATE TABLE comment
(
	application	varchar(20),
	component	varchar(20),
	id		varchar(60),
	content		text,

	PRIMARY KEY(application, category, id)
);