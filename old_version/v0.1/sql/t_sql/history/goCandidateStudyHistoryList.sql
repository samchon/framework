SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goCandidateStudyHistoryList') IS NOT NULL
	DROP PROCEDURE goCandidateStudyHistoryList;
GO
CREATE PROCEDURE goCandidateStudyHistoryList
	@studyUID NVARCHAR(100)
AS
	SELECT 
		M.id id, M.name name, S.type type, 
		CONVERT(VARCHAR, CAST(H.datetime AS DATETIME), 120) AS datetime
	FROM History.study S, History.history H, Hospital.member M
	WHERE 
		S.studyUID = @studyUID AND 
		H.uid = S.uid AND H.id = M.id
	FOR XML RAW(N'history'), ROOT(N'historyList');
GO