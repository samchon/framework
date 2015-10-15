SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goViewerStudy') IS NOT NULL	DROP PROCEDURE goViewerStudy;
IF OBJECT_ID('v_viewerImage') IS NOT NULL	DROP VIEW v_viewerImage;
GO

CREATE VIEW v_viewerImage
AS
	SELECT
		I.seriesUID,
		I.uid, 
		CONVERT(VARCHAR, CAST(I.datetime AS DATETIME), 120) AS datetime,
		D.width, D.height, D.position,
		D.signFlag, D.bitUnit,
		D.scaleX, D.scaleY
	FROM Inspect.image I, Inspect.imageData D
	WHERE I.uid = D.uid
GO

CREATE PROCEDURE goViewerStudy
	@studyUID NVARCHAR(100),
	@memberID NVARCHAR(100)
AS
	DECLARE @xml XML =
	(
		SELECT study.*, series.*, image.*
		FROM Inspect.study study 
			LEFT OUTER JOIN Inspect.series series 
				ON study.uid = series.studyUID
			LEFT OUTER JOIN v_viewerImage image
				ON series.uid = image.seriesUID
		WHERE study.uid = @studyUID
		FOR XML AUTO
	)
	
	IF(@xml IS NULL)
	BEGIN
		SELECT NULL;
		RETURN 0;
	END
	
	--MERGE PATIENT_INFO INTO STUDY
	DECLARE @patientXML XML = 
	(
		SELECT 
			id, name, gender, 
			CONVERT(VARCHAR, CAST(birthdate AS DATETIME), 120) AS birthdate
		FROM Hospital.patient
		WHERE 
			id =
			(
				SELECT TOP(1) patientID 
				FROM Inspect.media
				WHERE uid =
				(
					SELECT TOP(1) mediaUID 
					FROM Inspect.mediaStudyPair 
					WHERE studyUID = @studyUID
				)
			)
		FOR XML RAW(N'patient')
	)
	SET @xml.modify('insert sql:variable("@patientXML") into (/study[1])')

	--ACHIEVE HISTORY::INQUIRY(1)
	EXEC insertStudyHistory @studyUID, 1, @memberID

	SELECT @xml;
GO