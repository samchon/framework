SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goManagerHistoryList') IS NOT NULL
	DROP PROCEDURE goManagerHistoryList;
GO

CREATE PROCEDURE goManagerHistoryList
	@id NVARCHAR(100)
AS
	-- AUTHORITY_HISTORY
	DECLARE @authorityXML XML;
	WITH w_authority(no, authority, approver, datetime)
	AS
	(
		SELECT ROW_NUMBER() OVER(ORDER BY H.uid) no, A.authority, A.approver, H.datetime
		FROM History.history H, History.authority A
		WHERE H.id = @id AND H.uid = A.uid
	)
	SELECT @authorityXML = 
	(
		SELECT 
			T1.authority newAuth, T2.authority prevAuth, 
			T1.approver approver, 
			CONVERT(VARCHAR, CAST(T1.datetime AS DATETIME), 120) AS datetime
		FROM w_authority T1, w_authority T2
		WHERE T1.no = T2.no + 1
		FOR XML RAW(N'authority'), ROOT(N'authorityList')
	)

	-- LOGIN_HISTORY
	DECLARE @loginXML XML =
	(
		SELECT 
			ip, success, 
			CONVERT(VARCHAR, CAST(datetime AS DATETIME), 120) AS datetime
		FROM History.history H, History.login L
		WHERE H.uid = L.uid AND H.id = @id
		FOR XML RAW(N'login'), ROOT(N'loginList')
	)

	-- STUDY_HISTORY
	DECLARE @studyXML XML =
	(
		SELECT 
			S.uid studyUID, HS.type type, S.description description, 
			G.imageCount imageCount, G.seriesCount seriesCount, 
			CONVERT(VARCHAR, CAST(HH.datetime AS DATETIME), 120) AS datetime
		FROM 
			History.history HH, History.study HS,
			Inspect.study S,
			(
				SELECT studyUID, count(studyUID) seriesCount, SUM(imageCount) imageCount
				FROM 
				(
					SELECT MAX(R.studyUID) studyUID, count(R.uid) imageCount
					FROM Inspect.series R, Inspect.image I
					WHERE R.uid = I.seriesUID
					GROUP BY R.uid
				) TEMP
				GROUP BY studyUID
			) G
		WHERE
			HH.id = @id AND
			HH.uid = HS.uid AND 
			HS.studyUID = S.uid AND S.uid = G.studyUID
		FOR XML RAW(N'study'), ROOT(N'studyList')
	)

	DECLARE @xml XML = N'<history />'
	SET @xml.modify('insert sql:variable("@authorityXML") into (/history[1])')
	SET @xml.modify('insert sql:variable("@loginXML") into (/history[1])')
	SET @xml.modify('insert sql:variable("@studyXML") into (/history[1])')

	SELECT @xml;
GO