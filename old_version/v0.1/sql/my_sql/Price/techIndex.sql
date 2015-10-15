CREATE TABLE Price.techIndex
(
	code		CHAR(10),
	date		DATE,

	priceChange	INT,
	
	ma5		DOUBLE,
	ma20		DOUBLE,
	ma60		DOUBLE,
	ma120		DOUBLE,
	ma200		DOUBLE,

	cci		DOUBLE,
	obv		DOUBLE,
	vr		DOUBLE,
	pl		DOUBLE,
	stochasticsD	DOUBLE,
	stochasticsK	DOUBLE,

	macd		DOUBLE,
	macdLine	DOUBLE,

	PRIMARY KEY PK(code, date),
	INDEX dateIDX(date)
);