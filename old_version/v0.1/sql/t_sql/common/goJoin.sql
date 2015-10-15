SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

Use OraQ;

IF OBJECT_ID('goJoin') IS NOT NULL
	DROP PROCEDURE goJoin
GO

CREATE PROCEDURE goJoin
	@id NVARCHAR(100),
	@name NVARCHAR(100),
	@pass NVARCHAR(100),
	@department INT = 4,
	@comment NVARCHAR(MAX)
AS
	DECLARE @result BIT

	BEGIN TRY
		INSERT INTO Hospital.member VALUES (@id, @name, @pass, 1, @department, @comment);
		SET @result = 1;
	END TRY
	BEGIN CATCH
		SET @result = 0;
	END CATCH

	IF(@result = 1)
	BEGIN
		INSERT INTO History.history VALUES (@id, GETDATE());
		DECLARE @uid INT = SCOPE_IDENTITY();

		INSERT INTO History.authority VALUES (@uid, N'system', 1);
	END

	SELECT @result;
GO