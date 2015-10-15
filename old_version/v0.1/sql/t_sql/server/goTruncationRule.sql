SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goTruncationRule') IS NOT NULL
	DROP PROCEDURE goTruncationRule
GO

CREATE PROCEDURE goTruncationRule
AS
	SELECT TOP(1) dayLimit, leftSpace, unit
	FROM History.history H, Server.truncationRule truncationRule
	WHERE H.uid = truncationRule.uid
	ORDER BY H.uid DESC
	FOR XML AUTO
GO