SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

Use OraQ;

IF OBJECT_ID('goLogin') IS NOT NULL
	DROP PROCEDURE goLogin
GO

CREATE PROCEDURE goLogin
	@id NVARCHAR(100),
	@pass NVARCHAR(100),
	@ip NVARCHAR(15),
	@session NVARCHAR(100)
AS
	DECLARE @authority INT

	SELECT @authority = authority FROM Hospital.member
	WHERE id=@id AND pass=@pass;

	INSERT INTO History.history VALUES (@id, GETDATE());
	DECLARE @uid INT = SCOPE_IDENTITY()
	INSERT INTO History.login VALUES (@uid, @ip, @session, ISNULL(@authority, 0));

	SELECT ISNULL(@authority, 0);
GO