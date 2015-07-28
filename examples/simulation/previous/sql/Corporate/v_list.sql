CREATE VIEW Corporate.v_list
AS
SELECT
	C.code, replace(C.name, '&', '앤') name, C.market,
	P.close price, P.close - P.uprisePrice yesterday, S.face, S.volume,
	P.close * S.volume marketCap
FROM
	Corporate.list C,
	Price.v_priceToday P,
	Corporate.share S
WHERE
	C.market IN (1, 2) AND
	C.code = P.code AND P.code = S.code;