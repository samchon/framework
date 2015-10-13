SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('mergeNonDicomFile') IS NOT NULL
	DROP PROCEDURE mergeNonDicomFile;
GO

CREATE PROCEDURE mergeNonDicomFile
	@mediaUID INT,
	@name NVARCHAR(255),
	@extension NVARCHAR(8),
	@data VARBINARY(MAX),
	@datetime DATETIMEOFFSET
AS
	MERGE Inspect.nonDicomFile ORG
		USING (SELECT @mediaUID mediaUID, @name name, @extension extension) NEW
		ON (ORG.mediaUID = NEW.mediaUID AND ORG.name = NEW.name AND ORG.extension = NEW.extension)
	WHEN MATCHED THEN
		UPDATE SET data = @data, datetime = @datetime
	WHEN NOT MATCHED THEN
		INSERT VALUES (newid(), @mediaUID, @name, @extension, @data, @datetime);
GO