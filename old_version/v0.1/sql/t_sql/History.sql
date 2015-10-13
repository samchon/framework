SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;

IF(SCHEMA_ID('History') IS NOT NULL)
BEGIN
	IF(OBJECT_ID('Server.truncationRule') IS NOT NULL)		DROP TABLE Server.truncationRule;

	IF OBJECT_ID('Inspect.STUDY_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER Inspect.STUDY_PAIR_TRIGGER
	IF OBJECT_ID('Inspect.FILE_PAIR_TRIGGER', 'TR') IS NOT NULL
		DROP TRIGGER Inspect.FILE_PAIR_TRIGGER
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

	IF(OBJECT_ID('History.authority') IS NOT NULL)			DROP TABLE History.authority;
	IF(OBJECT_ID('History.error') IS NOT NULL)				DROP TABLE History.error;
	IF(OBJECT_ID('History.login') IS NOT NULL)				DROP TABLE History.login;
	IF(OBJECT_ID('History.study') IS NOT NULL)				DROP TABLE History.study;
	IF(OBJECT_ID('History.nonDicomFile') IS NOT NULL)		DROP TABLE History.nonDicomFile;
	IF(OBJECT_ID('History.invokeParameter') IS NOT NULL)	DROP TABLE History.invokeParameter;
	IF(OBJECT_ID('History.invoke') IS NOT NULL)				DROP TABLE History.invoke;
	IF(OBJECT_ID('History.history') IS NOT NULL)			DROP TABLE History.history;
	DROP SCHEMA History;
END
GO

CREATE SCHEMA History;
GO

--ABSTRACT TABLE
CREATE TABLE History.history
(
	uid INT PRIMARY KEY IDENTITY(1, 1),
	id NVARCHAR(100)
		FOREIGN KEY REFERENCES Hospital.member(id)
			ON DELETE CASCADE,
	datetime DATETIMEOFFSET
);

/* ----------------------------------------------------
	HISTORY OF MEMBER
---------------------------------------------------- */
CREATE TABLE History.authority
(
	uid INT
		PRIMARY KEY
		FOREIGN KEY REFERENCES History.history(uid) 
			ON DELETE CASCADE,
	approver NVARCHAR(100)
		FOREIGN KEY REFERENCES Hospital.member(id),
	authority INT
);
CREATE TABLE History.login
(
	uid INT
		PRIMARY KEY
		FOREIGN KEY REFERENCES History.history(uid) 
			ON DELETE CASCADE,
	ip NVARCHAR(15) NOT NULL,
	session NVARCHAR(100) NOT NULL,
	success BIT NOT NULL,
);

/* ----------------------------------------------------
	HISTORY OF STUDY
---------------------------------------------------- */
CREATE TABLE History.study
(
	uid INT
		PRIMARY KEY
		FOREIGN KEY REFERENCES History.history(uid) 
			ON DELETE CASCADE,
	studyUID NVARCHAR(100),
	type INT,

	INDEX IDX_STUDY_FK(studyUID)
);
CREATE TABLE History.nonDicomFile
(
	uid INT
		PRIMARY KEY
		FOREIGN KEY REFERENCES History.history(uid) 
			ON DELETE CASCADE,
	fileUID INT,
	type INT,

	INDEX IDX_FILE_FK(fileUID)
);

/* ----------------------------------------------------
	HISTORY OF INVOKE
---------------------------------------------------- */
CREATE TABLE History.invoke
(
	uid INT
		PRIMARY KEY
		FOREIGN KEY REFERENCES History.history(uid) 
			ON DELETE CASCADE,
	service INT,
	listener NVARCHAR(100)
);
CREATE TABLE History.invokeParameter
(
	invokeUID INT
		FOREIGN KEY REFERENCES History.invoke(uid) 
			ON DELETE CASCADE,
	no INT,
	name NVARCHAR(100),
	type NVARCHAR(100),
	value NVARCHAR(MAX),

	PRIMARY KEY(invokeUID, no)
);
CREATE TABLE History.error
(
	uid INT
		PRIMARY KEY
		FOREIGN KEY REFERENCES History.history(uid) 
			ON DELETE CASCADE,
	service INT,
	id INT
)
GO

/* ----------------------------------------------------
	TRIGGER FOR REVERSE-CASCADE DELETION
---------------------------------------------------- */
CREATE TRIGGER Inspect.STUDY_PAIR_TRIGGER
	ON Inspect.study
	FOR DELETE
AS
	--CASCADE DELETION THE MEDIA
	DELETE FROM History.study
	WHERE studyUID IN
	(
		SELECT uid
		FROM deleted
	);
GO
CREATE TRIGGER Inspect.FILE_PAIR_TRIGGER
	ON Inspect.nonDicomFile
	FOR DELETE
AS
	--CASCADE DELETION THE MEDIA
	DELETE FROM History.nonDicomFile
	WHERE fileUID IN
	(
		SELECT uid
		FROM deleted
	);
GO
CREATE TRIGGER History.STUDY_PAIR_TRIGGER
	ON History.study
	FOR DELETE
AS
	--CASCADE DELETION THE MEDIA
	DELETE FROM History.history
	WHERE uid IN
	(
		SELECT uid
		FROM deleted
	);
GO
CREATE TRIGGER History.FILE_PAIR_TRIGGER
	ON History.nonDicomFile
	FOR DELETE
AS
	--CASCADE DELETION THE MEDIA
	DELETE FROM History.history
	WHERE uid IN
	(
		SELECT uid
		FROM deleted
	);
GO
CREATE TRIGGER History.INVOKE_PAIR_TRIGGER
	ON History.invoke
	FOR DELETE
AS
	--CASCADE DELETION THE MEDIA
	DELETE FROM History.history
	WHERE uid IN
	(
		SELECT uid
		FROM deleted
	);
GO
CREATE TRIGGER History.ERROR_PAIR_TRIGGER
	ON History.error
	FOR DELETE
AS
	--CASCADE DELETION THE MEDIA
	DELETE FROM History.history
	WHERE uid IN
	(
		SELECT uid
		FROM deleted
	);
GO
CREATE TRIGGER History.LOGIN_PAIR_TRIGGER
	ON History.login
	FOR DELETE
AS
	--CASCADE DELETION THE MEDIA
	DELETE FROM History.history
	WHERE uid IN
	(
		SELECT uid
		FROM deleted
	);
GO