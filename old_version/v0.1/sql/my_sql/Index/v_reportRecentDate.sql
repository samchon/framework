CREATE VIEW Index.v_reportRecentDate
AS
SELECT
	code, standard, period, 
	max(date) date

FROM
	Index.report

GROUP BY
	code, standard, period