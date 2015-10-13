SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goCandidateMedia') IS NOT NULL	DROP PROCEDURE goCandidateMedia;
GO

CREATE PROCEDURE goCandidateMedia
	@uid INT
AS
	SELECT TOP(1) 
		U.id, U.name, 
		CONVERT(VARCHAR, CAST(H.datetime AS DATETIME), 120) AS datetime,
		CAST(M.picture AS IMAGE)
	FROM 
		History.history H, History.study S,
		Inspect.media M, Inspect.mediaStudyPair A,
		Hospital.member U
	WHERE 
		M.uid = @uid AND S.type = 0 AND
			M.uid = A.mediaUID AND
			A.studyUID = S.studyUID AND
			S.uid = H.uid AND 
			H.uid = S.uid AND
			H.id = U.id
	ORDER BY ABS(DATEDIFF(MS, M.datetime, H.datetime))
GO