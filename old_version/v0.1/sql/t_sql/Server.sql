SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
GO

IF(SCHEMA_ID('Server') IS NOT NULL)
BEGIN
	IF OBJECT_ID('Server.PACS_SERVER_TRIGGER', 'TR') IS NOT NULL	DROP TRIGGER Server.PACS_SERVER_TRIGGER;
	IF OBJECT_ID('Server.MWL_SERVER_TRIGGER', 'TR') IS NOT NULL		DROP TRIGGER Server.MWL_SERVER_TRIGGER;
	IF OBJECT_ID('Server.FILE_SERVER_TRIGGER', 'TR') IS NOT NULL	DROP TRIGGER Server.FILE_SERVER_TRIGGER;

	IF(OBJECT_ID('Server.fileServerRole') IS NOT NULL)	DROP TABLE Server.fileServerRole;
	IF(OBJECT_ID('Server.pacsServerRole') IS NOT NULL)	DROP TABLE Server.pacsServerRole;
	IF(OBJECT_ID('Server.fileServer') IS NOT NULL)		DROP TABLE Server.fileServer;
	IF(OBJECT_ID('Server.mwlServer') IS NOT NULL)		DROP TABLE Server.mwlServer;
	IF(OBJECT_ID('Server.pacsServer') IS NOT NULL)		DROP TABLE Server.pacsServer;
	IF(OBJECT_ID('Server.externalServer') IS NOT NULL)	DROP TABLE Server.externalServer;
	IF(OBJECT_ID('Server.truncationRule') IS NOT NULL)	DROP TABLE Server.truncationRule;
	DROP SCHEMA Server;
END
GO

CREATE SCHEMA Server
GO

/* -------------------------------------------------------------------
	TABLES
------------------------------------------------------------------- */
CREATE TABLE Server.truncationRule
(
	uid INT
		PRIMARY KEY
		FOREIGN KEY REFERENCES History.history(uid) 
			ON DELETE CASCADE,
	dayLimit INT,
	leftSpace INT,
	unit FLOAT
);

CREATE TABLE Server.externalServer
(
	name NVARCHAR(100) PRIMARY KEY,
	aeTitle NVARCHAR(100),
	ip NVARCHAR(15),
	port INT,

	UNIQUE(aeTitle, ip, port)
);
CREATE TABLE Server.mwlServer
(
	name NVARCHAR(100)
		PRIMARY KEY
		FOREIGN KEY REFERENCES Server.externalServer(name)
			ON DELETE CASCADE
);
CREATE TABLE Server.pacsServer
(
	name NVARCHAR(100)
		PRIMARY KEY
		FOREIGN KEY REFERENCES Server.externalServer(name)
			ON DELETE CASCADE
);
CREATE TABLE Server.fileServer
(
	name NVARCHAR(100)
		PRIMARY KEY
		FOREIGN KEY REFERENCES Server.externalServer(name)
			ON DELETE CASCADE,
	id NVARCHAR(100),
	pass NVARCHAR(100),
	path NVARCHAR(200)
);
CREATE TABLE Server.pacsServerRole
(
	name NVARCHAR(100)
		FOREIGN KEY REFERENCES Server.pacsServer(name)
			ON DELETE CASCADE,
	modality NVARCHAR(100),
	frameMode TINYINT,

	PRIMARY KEY(modality, frameMode)
);
CREATE TABLE Server.fileServerRole
(
	name NVARCHAR(100)
		FOREIGN KEY REFERENCES Server.fileServer(name)
			ON DELETE CASCADE,
	extension NVARCHAR(100) PRIMARY KEY
);
GO
/* -------------------------------------------------------------------
	TRIGGERS
------------------------------------------------------------------- */
CREATE TRIGGER Server.PACS_SERVER_TRIGGER
	ON Server.pacsServer
	FOR DELETE
AS
	DELETE FROM Server.externalServer
	WHERE name IN (SELECT name FROM deleted);
GO
CREATE TRIGGER Server.MWL_SERVER_TRIGGER
	ON Server.mwlServer
	FOR DELETE
AS
	DELETE FROM Server.externalServer
	WHERE name IN (SELECT name FROM deleted);
GO
CREATE TRIGGER Server.FILE_SERVER_TRIGGER
	ON Server.fileServer
	FOR DELETE
AS
	DELETE FROM Server.externalServer
	WHERE name IN (SELECT name FROM deleted);
GO