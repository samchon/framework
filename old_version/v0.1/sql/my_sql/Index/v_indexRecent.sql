CREATE VIEW v_reportRecent
AS
SELECT I.* 
FROM Index.report I, v_reportRecentDate D
WHERE I.code = D. code AND I.standard = D.standard AND I.period = D.period AND I.date = D.date;