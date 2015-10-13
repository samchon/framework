SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('insertNonDicomFileHistory') IS NOT NULL
	DROP PROCEDURE insertNonDicomFileHistory
GO

CREATE PROCEDURE insertNonDicomFileHistory
	@fileUID INT,
	@status INT,
	@memberID NVARCHAR(100)
AS
	--ACHIEVE HISTORY
	INSERT INTO History.history VALUES (@memberID, GETDATE());
	DECLARE @historyUID INT = SCOPE_IDENTITY()

	INSERT INTO History.nonDicomFile VALUES (@historyUID, @fileUID, @status);
GO