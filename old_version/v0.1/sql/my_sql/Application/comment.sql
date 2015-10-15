CREATE TABLE comment
(
	application VARCHAR(20),
	category VARCHAR(20),
	component VARCHAR(20),
	content text,

	PRIMARY KEY(application, category, component)
);