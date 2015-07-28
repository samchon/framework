CREATE TABLE sales
(
	code 		CHAR(10)	NOT NULL,
	standard	SMALLINT	NOT NULL,
	period		SMALLINT	NOT NULL,
	date		DATE,
#standard -> 0:GAAP, 1:IFRS
#period   -> 1:YEAR, 2:HALF, 4:QUARTER

#매출액
	sales		BIGINT		NOT NULL,

	PRIMARY KEY(code, standard, period, date),
	KEY code(code)
);