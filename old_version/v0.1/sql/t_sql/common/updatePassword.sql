SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

Use OraQ;
IF OBJECT_ID('updatePassword') IS NOT NULL
	DROP PROCEDURE updatePassword
GO

CREATE PROCEDURE updatePassword
	@id NVARCHAR(100),
	@prevPass NVARCHAR(100),
	@newPass NVARCHAR(100)
AS
	DECLARE @result INT;
		
	SELECT @result = count(*) FROM Hospital.member
	WHERE id=@id AND pass=@prevPass
	
	UPDATE Hospital.member 
		SET pass = @newPass 
	WHERE id = @id AND pass=@prevPass;

	SELECT @result;
GO