SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

Use OraQ;
IF OBJECT_ID('updatePrivateInformation') IS NOT NULL
	DROP PROCEDURE updatePrivateInformation
GO

CREATE PROCEDURE updatePrivateInformation
	@id NVARCHAR(100),
	@pass NVARCHAR(100),
	@department INT,
	@comment NVARCHAR(MAX)
AS
	DECLARE @result INT;
		
	SELECT @result = count(*) FROM Hospital.member
	WHERE id=@id AND pass=@pass;

	UPDATE Hospital.member SET
		department = @department,
		comment = @comment
	WHERE id = @id AND pass = @pass;

	SELECT @result;
GO