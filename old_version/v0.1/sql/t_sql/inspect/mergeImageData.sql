SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('mergeImageData') IS NOT NULL
	DROP PROCEDURE mergeImageData;
GO

CREATE PROCEDURE mergeImageData
	@uid NVARCHAR(100),
	@data VARBINARY(MAX),
	@width INT,
	@height INT,
	@position INT,
	@signFlag BIT,
	@bitUnit INT,
	@scaleX FLOAT,
	@scaleY FLOAT
AS
	MERGE Inspect.imageData ORG
		USING (SELECT @uid uid) NEW
		ON ORG.uid = NEW.uid
	WHEN MATCHED THEN
		UPDATE SET
			data = @data,
			width = @width,
			height = @height,
			position = @position,
			signFlag = @signFlag,
			bitUnit = @bitUnit,
			scaleX = @scaleX,
			scaleY = @scaleY
	WHEN NOT MATCHED THEN
		INSERT VALUES 
		(
			@uid, newid(), 
			@data, @width, @height, @position, 
			@signFlag, @bitUnit, 
			@scaleX, @scaleY
		);
GO
