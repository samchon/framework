CREATE VIEW v_price
AS
SELECT 
	C.code, C.date, C.high, C.low, C.open, C.close, C.volume,
	C.close * S.volume marketCap,
	T.uprisePrice, T.ma5, T.ma20, T.ma60, T.ma120, T.ma200,
	T.cci, T.obv, T.vr, T.pl, T.stochasticsD, T.stochasticsK,
	T.macd, T.macdLine
FROM
	Price.candle C,
	Price.techIndex T,
	Corporate.share S
WHERE
	C.code = T.code AND C.date = T.date AND
	C.code = S.code;