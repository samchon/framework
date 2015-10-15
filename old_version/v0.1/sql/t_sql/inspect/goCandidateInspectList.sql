SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('v_studyStatus') IS NOT NULL			DROP VIEW v_studyStatus;
IF OBJECT_ID('v_nonDicomFileStatus') IS NOT NULL	DROP VIEW v_nonDicomFileStatus;
IF OBJECT_ID('v_candidateStudy') IS NOT NULL		DROP VIEW v_candidateStudy;
IF OBJECT_ID('v_candidateFile') IS NOT NULL			DROP VIEW v_candidateFile;
IF OBJECT_ID('goCandidateInspectList') IS NOT NULL	DROP PROCEDURE goCandidateInspectList;
GO

CREATE VIEW v_studyStatus
AS
	WITH cte AS
	(
		SELECT S.studyUID uid, S.type type, ROW_NUMBER() OVER (PARTITION BY S.studyUID ORDER BY H.datetime DESC) no
		FROM History.history H, History.study S
		WHERE
			H.uid = S.uid AND type <> 1
	)
	SELECT 
		A.uid, 
		CASE WHEN B.type IS NULL THEN
			A.type
			ELSE 1
		END status
	FROM
	(
		SELECT uid, type
		FROM cte
		WHERE no = 1
	) A LEFT OUTER JOIN
	(
		SELECT studyUID uid, 1 type
		FROM History.study
		GROUP BY studyUID
		HAVING MAX(type) = 1
	) B ON A.uid = B.uid
GO
CREATE VIEW v_nonDicomFileStatus
AS
	WITH cte AS
	(
		SELECT
			F.fileUID uid, F.type type, 
			ROW_NUMBER() OVER (PARTITION BY F.fileUID ORDER BY H.datetime DESC) no
		FROM History.history H, History.nonDicomFile F
		WHERE
			H.uid = F.uid AND type <> 1
	)
	SELECT 
		A.uid, 
		CASE WHEN B.type IS NULL THEN
			A.type
			ELSE 1
		END status
	FROM
	(
		SELECT uid, type
		FROM cte
		WHERE no = 1
	) A LEFT OUTER JOIN
	(
		SELECT fileUID uid, 1 type
		FROM History.nonDicomFile
		GROUP BY fileUID
		HAVING MAX(type) = 1
	) B ON A.uid = B.uid
GO
CREATE VIEW v_candidateStudy
AS
	SELECT DISTINCT
		P.id patientID, 
			P.name patientName, P.gender patientGender, 
			CAST(P.birthdate AS DATE) patientBirthdate,
		S.uid, 
			S.description, 
			CONVERT(VARCHAR, CAST(S.datetime AS DATETIME), 120) AS datetime,
			H.status
	FROM
		Hospital.patient P, Inspect.media M, Inspect.mediaStudyPair A, 
		Inspect.study S, v_studyStatus H
	WHERE
		P.id = M.patientID AND M.uid = A.mediaUID AND A.studyUID = S.uid AND 
		S.uid = H.uid
GO
CREATE VIEW v_candidateFile
AS
	SELECT DISTINCT
		P.id patientID, 
			P.name patientName, P.gender patientGender, 
			CAST(P.birthdate AS DATE) patientBirthdate,
		M.uid mediaUID, 
			F.uid, F.name, F.extension, 
			CONVERT(VARCHAR, CAST(F.datetime AS DATETIME), 120) AS datetime,
			H.status
	FROM 
		Hospital.patient P, Inspect.media M, 
		Inspect.nonDicomFile F, v_nonDicomFileStatus H
	WHERE 
		P.id = M.patientID AND M.uid = F.mediaUID AND F.uid = H.uid
GO

CREATE PROCEDURE goCandidateInspectList
AS
	DECLARE @xml XML =
	(
		SELECT *
		FROM
		(
			SELECT N'candidate' service
		) inspect
		FOR XML AUTO
	)
	DECLARE @studyList XML =
	(
		SELECT study.*, series.*, image.*
		FROM
			v_candidateStudy study 
				LEFT OUTER JOIN Inspect.series series 
					ON study.uid = series.studyUID
				LEFT OUTER JOIN Inspect.image image
					ON series.uid = image.seriesUID
		FOR XML AUTO, ROOT(N'studyList')
	)
	DECLARE @fileList XML =
	(
		SELECT * FROM v_candidateFile
		FOR XML RAW(N'file'), ROOT(N'fileList')
	)

	IF(@studyList IS NOT NULL)	SET @xml.modify('insert sql:variable("@studyList") into (/inspect)[1]')
	IF(@fileList IS NOT NULL)	SET @xml.modify('insert sql:variable("@fileList") into (/inspect)[1]')

	SELECT @xml;
GO