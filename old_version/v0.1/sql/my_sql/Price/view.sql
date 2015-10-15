CREATE VIEW v_candle
AS
SELECT
	C.code, C.date, C.high, C.low, C.open, C.close, C.volume,
	T.marketCap, T.uprisePrice, T.ma5, T.ma20, T.ma120, T.ma200,
	T.cci, T.obv, T.vr, T.pl, T.stochasticsD, T.stochasticsK, T.macd, T.macdLine
FROM
	Price.candle C INNER JOIN Price.techIndex T
		ON C.code = T.code AND C.date = T.date;