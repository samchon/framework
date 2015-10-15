CREATE TABLE message
(
	uid		INT		PRIMARY KEY	AUTO_INCREMENT,
	sender		VARCHAR(60)	NOT NULL,
	receiver	VARCHAR(60)	NOT NULL,
	sentTime	TIMESTAMP	NOT NULL,
	readTime	TIMESTAMP,
	subject		VARCHAR(200)	NOT NULL,
	content		TEXT		NOT NULL,

	INDEX sender(sender),
	INDEX receiver(receiver)
);