CREATE TABLE candle
(
	code,
	open,
	close,
	high,
	low,
	volume,
	date

	PRIMARY KEY(code, date)
	INDEX date(date),
	INDEX code(code)
);