SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('updateTruncationRule') IS NOT NULL
	DROP PROCEDURE updateTruncationRule
GO

CREATE PROCEDURE updateTruncationRule
	@id NVARCHAR(100),
	@dayLimit INT,
	@leftSpace INT,	
	@unit FLOAT
AS
	INSERT INTO History.history VALUES (@id, GETDATE());
	DECLARE @uid INT = SCOPE_IDENTITY()

	INSERT INTO Server.truncationRule VALUES (@uid, @dayLimit, @leftSpace, @unit);
GO

EXEC updateTruncationRule N'system', 40, 25, 0.15;