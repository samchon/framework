SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goCandidateNonDicomFileHistoryList') IS NOT NULL
	DROP PROCEDURE goCandidateNonDicomFileHistoryList;
GO
CREATE PROCEDURE goCandidateNonDicomFileHistoryList
	@fileUID INT
AS
	SELECT M.id id, M.name name, F.type type, H.datetime datetime
	FROM History.nonDicomFile F, History.history H, Hospital.member M
	WHERE 
		F.fileUID = @fileUID AND 
		H.uid = F.uid AND H.id = M.id
	FOR XML RAW(N'history'), ROOT(N'historyList');
GO