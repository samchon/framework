SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;

IF(SCHEMA_ID('Hospital') IS NOT NULL)
BEGIN
	IF OBJECT_ID('History.STUDY_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER History.STUDY_PAIR_TRIGGER
	IF OBJECT_ID('History.FILE_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER History.FILE_PAIR_TRIGGER
	IF OBJECT_ID('History.INVOKE_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER History.INVOKE_PAIR_TRIGGER
	IF OBJECT_ID('History.ERROR_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER History.ERROR_PAIR_TRIGGER
	IF OBJECT_ID('History.LOGIN_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER History.LOGIN_PAIR_TRIGGER

	IF(OBJECT_ID('Server.truncationRule') IS NOT NULL)	DROP TABLE Server.truncationRule;
	IF(OBJECT_ID('History.authority') IS NOT NULL)			DROP TABLE History.authority;
	IF(OBJECT_ID('History.error') IS NOT NULL)				DROP TABLE History.error;
	IF(OBJECT_ID('History.login') IS NOT NULL)				DROP TABLE History.login;
	IF(OBJECT_ID('History.study') IS NOT NULL)				DROP TABLE History.study;
	IF(OBJECT_ID('History.nonDicomFile') IS NOT NULL)		DROP TABLE History.nonDicomFile;
	IF(OBJECT_ID('History.invokeParameter') IS NOT NULL)	DROP TABLE History.invokeParameter;
	IF(OBJECT_ID('History.invoke') IS NOT NULL)				DROP TABLE History.invoke;
	IF(OBJECT_ID('History.history') IS NOT NULL)			DROP TABLE History.history;

	IF(OBJECT_ID('History.study') IS NOT NULL)			DROP TABLE History.study;
	IF(OBJECT_ID('History.nonDicomFile') IS NOT NULL)	DROP TABLE History.nonDicomFile;

	IF OBJECT_ID('Inspect.INSPECT_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER Inspect.INSPECT_PAIR_TRIGGER

	IF(OBJECT_ID('Inspect.imageData') IS NOT NULL)		DROP TABLE Inspect.imageData;
	IF(OBJECT_ID('Inspect.image') IS NOT NULL)			DROP TABLE Inspect.image;
	IF(OBJECT_ID('Inspect.series') IS NOT NULL)			DROP TABLE Inspect.series;
	IF(OBJECT_ID('Inspect.mediaStudyPair') IS NOT NULL)	DROP TABLE Inspect.mediaStudyPair;
	IF(OBJECT_ID('Inspect.study') IS NOT NULL)			DROP TABLE Inspect.study;
	IF(OBJECT_ID('Inspect.nonDicomFile') IS NOT NULL)	DROP TABLE Inspect.nonDicomFile;
	IF(OBJECT_ID('Inspect.media') IS NOT NULL)			DROP TABLE Inspect.media;

	IF(OBJECT_ID('Hospital.member') IS NOT NULL)		DROP TABLE Hospital.member;
	IF(OBJECT_ID('Hospital.patient') IS NOT NULL)		DROP TABLE Hospital.patient;
	IF(OBJECT_ID('Hospital.department') IS NOT NULL)	DROP TABLE Hospital.department;
	
	DROP SCHEMA Hospital;
END
GO

CREATE SCHEMA Hospital;
GO

CREATE TABLE Hospital.department
(
	uid INT PRIMARY KEY IDENTITY(1, 1),
	name NVARCHAR(100)
);
CREATE TABLE Hospital.patient
(
	id NVARCHAR(100) PRIMARY KEY,
	name NVARCHAR(100),
	gender NCHAR(1),
	birthdate DATETIMEOFFSET
);
CREATE TABLE Hospital.member
(
	id NVARCHAR(100) PRIMARY KEY,
	name NVARCHAR(100) NOT NULL,
	pass NVARCHAR(100) NOT NULL,
	authority INT NOT NULL,
	department INT NOT NULL
		FOREIGN KEY REFERENCES Hospital.department(uid),
	comment NVARCHAR(MAX) NOT NULL
);

INSERT INTO Hospital.department VALUES
	(N'SYSTEM');
INSERT INTO Hospital.member VALUES
	(N'system', N'system', N'1231', 4, 1, N'Automatically-genereted account'),
	(N'guest', N'guest', N'', 1, 1, N'Guest Account');