/*
==================================================================
	CORPORATE NAME FILTERING
==================================================================
*/
CREATE TABLE Yonsei.mv_corporateName
AS
SELECT corporateKey, name
FROM Dart.corporateNameHistory;

INSERT INTO Yonsei.mv_corporateName
SELECT corporateKey, summaryName FROM Dart.corporation;

UPDATE Yonsei.mv_corporateName SET name = replace(name, '㈜', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(주식회사)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(주식)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(주)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '주)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '주식회사', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '주식', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(유한회사)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(유한)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(유)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '유)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '유한회사', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '유한', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(합자회사)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(합자)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '(합)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '합)', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '합자회사', '');
UPDATE Yonsei.mv_corporateName SET name = replace(name, '합자', '');

/*
==================================================================
	CORPORATE KEY COMPOSING IN ALUMNI
==================================================================
*/
INSERT INTO alumni
SELECT * FROM
(
	SELECT DISTINCT A.no, A.name, A.mobile, A.mail, A.note, A.position, A.major, N.corporateKey
	FROM Yonsei.t_alumni A, Yonsei.mv_corporateName N
	WHERE A.corporateName = N.name
) T
GROUP BY no
HAVING count(no) = 1

/*
==================================================================
	CORPORATE KEY COMPOSING IN ALUMNI_CORPORATION
==================================================================
*/
INSERT INTO corporation
SELECT
	corporateKey,
	president, category, mainProduct, size, employed, 
	establishedYear, settledYear, asset, sales,
	address, tel, fax
FROM
(
	SELECT DISTINCT N.corporateKey, C.*
	FROM Yonsei.t_corporation C, Yonsei.mv_corporateName N
	WHERE C.corporateName = N.name
) T
GROUP BY corporateName
HAVING count(*) = 1
























