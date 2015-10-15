SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF (OBJECT_ID('mergeInspect') IS NOT NULL)				DROP PROCEDURE mergeInspect;
IF(TYPE_ID('PATIENT_MERGE_TABLE') IS NOT NULL)			DROP TYPE PATIENT_MERGE_TABLE;
IF(TYPE_ID('MEDIA_MERGE_TABLE') IS NOT NULL)			DROP TYPE MEDIA_MERGE_TABLE;
IF(TYPE_ID('NON_DICOM_FILE_MERGE_TABLE') IS NOT NULL)	DROP TYPE NON_DICOM_FILE_MERGE_TABLE;
IF(TYPE_ID('STUDY_MERGE_TABLE') IS NOT NULL)			DROP TYPE STUDY_MERGE_TABLE;
IF(TYPE_ID('SERIES_MERGE_TABLE') IS NOT NULL)			DROP TYPE SERIES_MERGE_TABLE;
IF(TYPE_ID('IMAGE_MERGE_TABLE') IS NOT NULL)			DROP TYPE IMAGE_MERGE_TABLE;
GO

CREATE TYPE PATIENT_MERGE_TABLE AS TABLE
(
	id NVARCHAR(100),
	name NVARCHAR(100),
	gender NCHAR(1),
	birthdate DATETIMEOFFSET
);
CREATE TYPE MEDIA_MERGE_TABLE AS TABLE
(
	patientID NVARCHAR(100),
	name NVARCHAR(100),
	picture VARBINARY(MAX),
	importer NVARCHAR(100)
);
CREATE TYPE STUDY_MERGE_TABLE AS TABLE
(
	uid NVARCHAR(100),
	description NVARCHAR(100),
	datetime DATETIMEOFFSET
);
CREATE TYPE SERIES_MERGE_TABLE AS TABLE
(
	uid NVARCHAR(100),
	studyUID NVARCHAR(100),
	no INT,
	modality NVARCHAR(100),
	datetime DATETIMEOFFSET
);
CREATE TYPE IMAGE_MERGE_TABLE AS TABLE
(
	uid NVARCHAR(100),
	seriesUID NVARCHAR(100),
	no INT,
	datetime DATETIMEOFFSET
);
GO

CREATE PROCEDURE mergeInspect
	@patientTable PATIENT_MERGE_TABLE READONLY,
	@mediaTable MEDIA_MERGE_TABLE READONLY,
	@studyTable STUDY_MERGE_TABLE READONLY,
	@seriesTable SERIES_MERGE_TABLE READONLY,
	@imageTable IMAGE_MERGE_TABLE READONLY
AS
	DECLARE @mediaUID INT

	/* -----------------------------------------------------
		MERGE INTO PATIENT, MEDIA
	----------------------------------------------------- */
	--PATIENT
	MERGE Hospital.patient ORG
		USING @patientTable NEW
		ON ORG.id = NEW.id
	WHEN MATCHED THEN
		UPDATE SET
			ORG.name = NEW.name,
			ORG.gender = NEW.gender,
			ORG.birthdate = NEW.birthdate
	WHEN NOT MATCHED THEN
		INSERT VALUES (NEW.id, NEW.name, NEW.gender, NEW.birthdate);

	--MEDIA AND ITS UID
	INSERT INTO Inspect.media
	SELECT patientID, name, picture, importer, GETDATE() 
		FROM @mediaTable;

	SET @mediaUID = SCOPE_IDENTITY()

	/* -----------------------------------------------------
		MERGE INTO STUDY
	----------------------------------------------------- */
	MERGE Inspect.study ORG
		USING @studyTable NEW
		ON ORG.uid = NEW.uid
	WHEN MATCHED THEN
		UPDATE SET
			ORG.description = NEW.description,
			ORG.datetime = NEW.datetime
	WHEN NOT MATCHED THEN
		INSERT VALUES (NEW.uid, NEW.description, NEW.datetime);

	--MERGE INTO SERIES
	MERGE Inspect.series ORG
		USING @seriesTable NEW
		ON ORG.uid = NEW.uid
	WHEN MATCHED THEN
		UPDATE SET
			ORG.studyUID = NEW.studyUID,
			ORG.no = NEW.no,
			ORG.modality = NEW.modality,
			ORG.datetime = NEW.datetime
	WHEN NOT MATCHED THEN
		INSERT VALUES (NEW.uid, NEW.studyUID, NEW.no, NEW.modality, NEW.datetime);

	--MERGE INTO IMAGE
	MERGE Inspect.image ORG
		USING @imageTable NEW
		ON ORG.uid = NEW.uid
	WHEN MATCHED THEN
		UPDATE SET
			ORG.seriesUID = NEW.seriesUID,
			ORG.no = NEW.no,
			ORG.datetime = NEW.datetime
	WHEN NOT MATCHED THEN
		INSERT VALUES (NEW.uid, NEW.seriesUID, NEW.no, NEW.datetime);

	/* -----------------------------------------------------
		SUPPLEMENTARY
	----------------------------------------------------- */
	--INSERT INTO MEDIA_STUDY_PAIR
	INSERT INTO Inspect.mediaStudyPair
	SELECT @mediaUID, uid
	FROM @studyTable;

	SELECT @mediaUID;
GO
