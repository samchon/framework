SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF(SCHEMA_ID('Inspect') IS NOT NULL)
BEGIN
	IF(OBJECT_ID('History.study') IS NOT NULL)			DROP TABLE History.study;
	IF(OBJECT_ID('History.nonDicomFile') IS NOT NULL)	DROP TABLE History.nonDicomFile;

	IF OBJECT_ID('Inspect.INSPECT_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER Inspect.INSPECT_PAIR_TRIGGER
	IF OBJECT_ID('Inspect.STUDY_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER Inspect.STUDY_PAIR_TRIGGER
	IF OBJECT_ID('Inspect.FILE_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER Inspect.FILE_PAIR_TRIGGER

	IF(OBJECT_ID('Inspect.imageData') IS NOT NULL)		DROP TABLE Inspect.imageData;
	IF(OBJECT_ID('Inspect.image') IS NOT NULL)			DROP TABLE Inspect.image;
	IF(OBJECT_ID('Inspect.series') IS NOT NULL)			DROP TABLE Inspect.series;
	IF(OBJECT_ID('Inspect.mediaStudyPair') IS NOT NULL)	DROP TABLE Inspect.mediaStudyPair;
	IF(OBJECT_ID('Inspect.study') IS NOT NULL)			DROP TABLE Inspect.study;
	IF(OBJECT_ID('Inspect.nonDicomFile') IS NOT NULL)	DROP TABLE Inspect.nonDicomFile;
	IF(OBJECT_ID('Inspect.media') IS NOT NULL)			DROP TABLE Inspect.media;
	DROP SCHEMA Inspect;
END
GO

CREATE SCHEMA Inspect
GO

/* ----------------------------------------------------
	DICOM DIR & NON-DICOM FILE
---------------------------------------------------- */
CREATE TABLE Inspect.media
(
	uid INT PRIMARY KEY IDENTITY(1, 1),
	patientID NVARCHAR(100)
		FOREIGN KEY REFERENCES Hospital.patient(id)
			ON DELETE CASCADE,
	name NVARCHAR(100),
	picture VARBINARY(MAX),
	importer NVARCHAR(100)
		FOREIGN KEY REFERENCES Hospital.member(id)
			ON DELETE CASCADE,
	datetime DATETIMEOFFSET,

	INDEX IDX_MEDIA_PATIENTID(patientID)
);
CREATE TABLE Inspect.nonDicomFile
(
	uid INT PRIMARY KEY IDENTITY(1, 1),
	fileUID UNIQUEIDENTIFIER ROWGUIDCOL UNIQUE,
	mediaUID INT
		FOREIGN KEY REFERENCES Inspect.media(uid)
			ON DELETE CASCADE,
	name NVARCHAR(255),
	extension NVARCHAR(8),
	data VARBINARY(MAX),
	datetime DATETIMEOFFSET,

	INDEX IDX_FILE_FK(mediaUID)
);

/* ----------------------------------------------------
	STUDY - SERIES - IMAGE
---------------------------------------------------- */
CREATE TABLE Inspect.study
(
	uid NVARCHAR(100) PRIMARY KEY,
	description NVARCHAR(MAX),
	datetime DATETIMEOFFSET
);
CREATE TABLE Inspect.series
(
	uid NVARCHAR(100) PRIMARY KEY,
	
	studyUID NVARCHAR(100)
		FOREIGN KEY REFERENCES Inspect.study(uid)
			ON DELETE CASCADE,
	no INT,
		--UNIQUE(studyUID, no),

	modality NVARCHAR(100),
	datetime DATETIMEOFFSET,

	INDEX IDX_SERIES_FK(studyUID)
);
CREATE TABLE Inspect.image
(
	uid NVARCHAR(100) PRIMARY KEY,

	seriesUID NVARCHAR(100)
		FOREIGN KEY REFERENCES Inspect.series(uid)
			ON DELETE CASCADE,
	no INT,
	datetime DATETIMEOFFSET,

	INDEX IDX_SERIES_FK(seriesUID)
);
CREATE TABLE Inspect.imageData
(
	uid NVARCHAR(100)
		PRIMARY KEY
		FOREIGN KEY REFERENCES Inspect.image(uid)
			ON DELETE CASCADE,
	fileUID UNIQUEIDENTIFIER ROWGUIDCOL UNIQUE NOT NULL,
	data VARBINARY(MAX) FILESTREAM,

	width INT,
	height INT,
	position INT,
	signFlag BIT,
	bitUnit INT,
	scaleX FLOAT,
	scaleY FLOAT
);

/* ----------------------------------------------------
	INTERSECTION RELATIONSHIP
		PAIR WITH MEDIA AND STUDY
	& TRIGGER
---------------------------------------------------- */
CREATE TABLE Inspect.mediaStudyPair
(
	mediaUID INT
		FOREIGN KEY REFERENCES Inspect.media(uid)
			ON DELETE CASCADE,
	studyUID NVARCHAR(100)
		FOREIGN KEY REFERENCES Inspect.study(uid)
			ON DELETE CASCADE,

	PRIMARY KEY(mediaUID, studyUID)
);
GO

CREATE TRIGGER Inspect.INSPECT_PAIR_TRIGGER
	ON Inspect.mediaStudyPair
	FOR DELETE
AS
	--CASCADE DELETION THE MEDIA
	DELETE FROM Inspect.media
	WHERE uid IN
	(
		SELECT DISTINCT mediaUID
		FROM deleted
		WHERE mediaUID NOT IN 
			(SELECT mediaUID FROM Inspect.mediaStudyPair)
	);

	--CASCADE DELETION FOR STUDY
	DELETE FROM Inspect.study
	WHERE uid IN
	(
		SELECT DISTINCT studyUID
		FROM deleted
		WHERE studyUID NOT IN 
			(SELECT studyUID FROM Inspect.mediaStudyPair)
	);
GO