#####################################
# PRICE
#####################################
SELECT	
	P.close,
	C.face,
	P.close*C.volume marketCap,
	Y.close yesterday,
	L.name
FROM	
	(
		SELECT code, close FROM Price.daily
		WHERE code = '005930'
		ORDER BY date DESC LIMIT 0, 1
	) P,
	Company.info C,
	(
		SELECT code, close FROM Price.daily
		WHERE code = '005930'
		ORDER BY date DESC LIMIT 1, 1
	) Y,
	Company.list L
WHERE
	P.code = C.code AND C.code = Y.code AND Y.code = L.code;

#####################################
# INDEX
#####################################
SELECT
	Y.EPS, Y.BPS, Y.SPS, Y.PER, Y.PBR, Y.PSR,
	Q.debtRatio, Q.currentRatio
FROM
	(
		SELECT code, EPS, BPS, SPS, PER, PBR, PSR
		FROM Company.indices
		WHERE code = '005930' AND standard=1 AND period=4
		ORDER BY date DESC LIMIT 1
	) Y,
	(
		SELECT code, debtRatio, currentRatio
		FROM Company.indices
		WHERE code = '005930' AND standard=1 AND period=1
		ORDER BY date DESC LIMIT 1
	) Q
WHERE
	Y.code = Q.code