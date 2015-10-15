SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;

IF OBJECT_ID('goDepartmentList') IS NOT NULL
	DROP PROCEDURE goDepartmentList
GO

CREATE PROCEDURE goDepartmentList
AS
	SELECT * FROM Hospital.department
	FOR XML RAW(N'department'), ROOT(N'departmentList')
GO