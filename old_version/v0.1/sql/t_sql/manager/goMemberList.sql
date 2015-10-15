SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
GO

IF OBJECT_ID('v_member') IS NOT NULL
	DROP VIEW v_member;
GO
CREATE VIEW v_member
AS
SELECT M.id, M.name, m.authority, M.department, G.datetime
FROM Hospital.member M,
(
	SELECT H.id, MAX(H.datetime) datetime
	FROM History.history H, History.login L
	WHERE H.uid = L.uid AND L.success = 1
	GROUP BY H.id
) G
WHERE M.id = G.id;
GO

IF OBJECT_ID('goMemberList') IS NOT NULL
	DROP PROCEDURE goMemberList
GO
CREATE PROCEDURE goMemberList
	@field NVARCHAR(100) = NULL,
	@val NVARCHAR(100) = NULL
AS
	DECLARE @xml XML;

	IF(@field IS NULL)
		SET @xml = 
		(
			SELECT * FROM v_member
			FOR XML RAW(N'member'), ROOT(N'memberList')
		)
	ELSE
	BEGIN
		IF(@field = N'department' OR @field = N'authority')
		BEGIN
			DECLARE @numValue INT = CAST(@val AS INT)
			
			IF(@field = N'department')
				SET @xml = 
				(
					SELECT * FROM v_member
					WHERE department = @numValue
					FOR XML RAW(N'member'), ROOT(N'memberList')
				)
			ELSE IF(@field = N'authority')
				SET @xml = 
				(
					SELECT * FROM v_member
					WHERE authority = @numValue
					FOR XML RAW(N'member'), ROOT(N'memberList')
				)
		END
		ELSE
		BEGIN
			IF(@field = N'id')
				SET @xml =
				(
					SELECT * FROM v_member
					WHERE LOWER(id) LIKE '%' + LOWER(@val) + '%'
					FOR XML RAW(N'member'), ROOT(N'memberList')
				)
			ELSE IF(@field = N'name')
				SET @xml =
				(
					SELECT * FROM v_member
					WHERE LOWER(name) LIKE '%' + LOWER(@val) + '%'
					FOR XML RAW(N'member'), ROOT(N'memberList')
				)
		END
	END

	SELECT @xml;
GO