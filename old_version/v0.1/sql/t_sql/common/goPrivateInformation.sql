SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

Use OraQ;
IF OBJECT_ID('goPrivateInformation') IS NOT NULL
	DROP PROCEDURE goPrivateInformation
GO

CREATE PROCEDURE goPrivateInformation
	@id NVARCHAR(100)
AS
	SELECT name, authority, department, comment
	FROM Hospital.member member 
	WHERE id = @id;
GO