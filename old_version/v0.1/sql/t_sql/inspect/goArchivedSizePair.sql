SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goArchivedSizePair') IS NOT NULL
	DROP PROCEDURE goArchivedSizePair;
GO

CREATE PROCEDURE goArchivedSizePair
AS
	SELECT M.size, I.size
	FROM
	(
		SELECT count(*) size
		FROM Inspect.media
	) M,
	(
		SELECT count(*) size
		FROM Inspect.image
	) I
GO