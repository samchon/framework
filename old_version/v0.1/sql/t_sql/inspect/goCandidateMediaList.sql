SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goCandidateMediaList') IS NOT NULL	DROP PROCEDURE goCandidateMediaList;
GO

CREATE PROCEDURE goCandidateMediaList
	@studyUID NVARCHAR(100)
AS
	SELECT 
		CAST(ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS NVARCHAR(10)) + N'. ' + ISNULL(M.name, N'No name') label, 
		M.uid data
	FROM Inspect.media M, Inspect.mediaStudyPair A
	WHERE A.studyUID = @studyUID AND M.uid = A.mediaUID
	FOR XML RAW(N'media'), ROOT(N'mediaList');
GO