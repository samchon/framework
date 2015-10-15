SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('goExternalServerList') IS NOT NULL
	DROP PROCEDURE goExternalServerList
GO

CREATE PROCEDURE goExternalServerList
	@type INT
AS
	IF (@type = 1) --PACS SERVER
		SELECT server.*, role.modality, role.frameMode
		FROM Server.externalServer server 
			INNER JOIN Server.pacsServer P
				ON server.name = P.name
			LEFT OUTER JOIN Server.pacsServerRole role
				ON P.name = role.name
		FOR XML AUTO, ROOT(N'serverList');
	ELSE IF (@type = 2) --MWL SERVER
		SELECT server.*
		FROM Server.externalServer server
			INNER JOIN Server.mwlServer M
				ON server.name = M.name
		FOR XML AUTO, ROOT(N'serverList');
	ELSE IF (@type = 3)
		SELECT server.*, role.extension
		FROM 
			(
				SELECT E.name, E.aeTitle, E.ip, E.port, F.id, F.pass, F.path
				FROM Server.externalServer E, Server.fileServer F
				WHERE E.name = F.name
			) AS server
		/*Server.externalServer server 
			INNER JOIN Server.fileServer F
				ON server.name = F.name*/
			LEFT OUTER JOIN Server.fileServerRole role
				ON server.name = role.name
		FOR XML AUTO, ROOT(N'serverList');
	ELSE
		SELECT NULL;
GO