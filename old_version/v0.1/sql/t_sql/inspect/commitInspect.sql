SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF (OBJECT_ID('commitInspect') IS NOT NULL)
	DROP PROCEDURE commitInspect;
GO

CREATE PROCEDURE commitInspect
	@mediaUID INT,
	@memberID NVARCHAR(100)
AS
	/* ---------------------------------------------------------
		FETCH STUDY_LIST
	--------------------------------------------------------- */
	DECLARE @studyTable TABLE
	(
		uid NVARCHAR(100)
	);
	DECLARE @fileTable TABLE
	(
		uid INT
	);

	INSERT INTO @studyTable
		SELECT studyUID
		FROM Inspect.mediaStudyPair
			WHERE mediaUID = @mediaUID
				ORDER BY studyUID;
	INSERT INTO @fileTable
		SELECT uid
		FROM Inspect.nonDicomFile
			WHERE mediaUID = @mediaUID
				ORDER BY fileUID;

	/* ---------------------------------------------------------
		ARCHIVE TO STUDY_STATUS
	--------------------------------------------------------- */
	DECLARE @historyTable TABLE
	(
		uid INT
	);
	INSERT INTO History.history
		OUTPUT Inserted.uid
			INTO @historyTable
		SELECT @memberID, GETDATE()
			FROM @studyTable;
	INSERT INTO History.study
		SELECT H.uid, S.uid, 0
		FROM
		(
			SELECT ROW_NUMBER() OVER(ORDER BY uid) idx, uid
			FROM @historyTable
		) H,
		(
			SELECT ROW_NUMBER() OVER (ORDER BY uid) idx, uid
			FROM @studyTable
		) S
		WHERE H.idx = S.idx;

	DELETE FROM @historyTable;
	INSERT INTO History.history
		OUTPUT Inserted.uid
			INTO @historyTable
		SELECT @memberID, GETDATE()
			FROM @fileTable;
	INSERT INTO History.nonDicomFile
		SELECT H.uid, F.uid, 0
		FROM
		(
			SELECT ROW_NUMBER() OVER(ORDER BY uid) idx, uid
			FROM @historyTable
		) H,
		(
			SELECT ROW_NUMBER() OVER (ORDER BY uid) idx, uid
			FROM @fileTable
		) F
		WHERE H.idx = F.idx;

	/* ---------------------------------------------------------
		REVERSE DELETION
	--------------------------------------------------------- */
	DELETE FROM Inspect.image
	WHERE 
		seriesUID IN
		(
			SELECT uid 
			FROM Inspect.series
			WHERE studyUID IN (SELECT uid FROM @studyTable)
		) AND
		uid NOT IN
		(
			SELECT uid 
			FROM Inspect.imageData
		);
	DELETE FROM Inspect.series
	WHERE 
		studyUID IN (SELECT uid FROM @studyTable) AND
		uid NOT IN (SELECT seriesUID FROM Inspect.image);
	DELETE FROM Inspect.study
	WHERE
		uid IN (SELECT uid FROM @studyTable) AND
		uid NOT IN (SELECT studyUID FROM Inspect.series);

	/* ---------------------------------------------------------
		UPDATE PATIENT INFORMATION
	--------------------------------------------------------- */
	DECLARE @patientID NVARCHAR(100)
	SELECT @patientID = patientID
	FROM Inspect.media
	WHERE uid = @mediaUID;

	UPDATE Inspect.media
		SET patientID = @patientID
	WHERE uid IN
	(
		SELECT DISTINCT mediaUID
		FROM Inspect.mediaStudyPair
		WHERE studyUID IN
		(
			SELECT uid FROM @studyTable
		)
	)
GO