CREATE TABLE list
(
	no	CHAR(10),
	code	CHAR(10)	NOT NULL	PRIMARY KEY,
	name	VARCHAR(100),
	nameEng	VARCHAR(100),
	market	SMALLINT	NOT NULL	DEFAULT 0

		# 0: delisted
		# 1: kospi
		# 2: kosdaq	
);