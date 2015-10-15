SET 
  ANSI_NULLS, 
  QUOTED_IDENTIFIER, 
  CONCAT_NULL_YIELDS_NULL, 
  ANSI_WARNINGS, 
  ANSI_PADDING 
ON;

USE OraQ;
IF OBJECT_ID('v_studySpace') IS NOT NULL		DROP VIEW v_studySpace;
IF OBJECT_ID('v_nonDicomFileSpace') IS NOT NULL	DROP VIEW v_nonDicomFileSpace;
IF OBJECT_ID('v_space') IS NOT NULL				DROP VIEW v_space;

IF OBJECT_ID('doTruncateByStatus') IS NOT NULL	DROP PROCEDURE doTruncateByStatus;
IF OBJECT_ID('doTruncate') IS NOT NULL			DROP PROCEDURE doTruncate;
GO

CREATE VIEW v_studySpace
AS
	SELECT 
		S.uid, MAX(S.status) status, 
		SUM( CAST(DATALENGTH(F.data) AS BIGINT) ) volume, 
		MAX(M.datetime) datetime
	FROM 
		v_studyStatus S, Inspect.series R, 
		Inspect.image I, Inspect.imageData F,
		(
			SELECT P.studyUID, MAX(M.datetime) datetime
			FROM Inspect.media M, Inspect.mediaStudyPair P
			WHERE M.uid = P.mediaUID
			GROUP BY P.studyUID
		) M
	WHERE
		M.studyUID = S.uid AND
		S.uid = R.studyUID AND R.uid = I.seriesUID AND
		I.uid = F.uid
	GROUP BY S.uid;
GO
CREATE VIEW v_nonDicomFileSpace
AS
	SELECT 
		F.uid, H.status, 
		CAST(DATALENGTH(F.data) AS BIGINT) volume, 
		M.datetime
	FROM
		Inspect.media M, 
		Inspect.nonDicomFile F,
		v_nonDicomFileStatus H
	WHERE M.uid = F.mediaUID AND F.uid = H.uid;
GO
CREATE VIEW v_space
AS
	SELECT volume, status, datetime FROM
	(
		SELECT volume, status, datetime
		FROM v_studySpace
		UNION ALL
		SELECT volume, status, datetime
		FROM v_nonDicomFileSpace
	) T;
GO

CREATE PROCEDURE doTruncateByStatus
	@targetSpace BIGINT,
	@status INT,
	@day INT,
	@shrinkedSpace BIGINT OUTPUT
AS
	DECLARE @cursor CURSOR
	DECLARE @volume BIGINT
	DECLARE @datetime DATETIMEOFFSET

	IF @shrinkedSpace >= @targetSpace
		RETURN 1;

	IF @status IS NOT NULL
		IF @day IS NOT NULL --STATUS && DAY
			SET @cursor = CURSOR 
			FOR
				SELECT volume, datetime FROM v_space
				WHERE 
					status = @status AND
					DATEDIFF(day, datetime, GETDATE()) >= @day
				ORDER BY datetime ASC;
		ELSE --STATUS
			SET @cursor = CURSOR 
			FOR
				SELECT volume, datetime FROM v_space
				WHERE 
					status = @status
				ORDER BY datetime ASC;
	ELSE BEGIN
		IF @day IS NOT NULL --DAY
			SET @cursor = CURSOR 
			FOR
				SELECT volume, datetime FROM v_space
				WHERE DATEDIFF(day, datetime, GETDATE()) >= @day
				ORDER BY datetime ASC;
		ELSE --NOTHING; ALL
			SET @cursor = CURSOR 
			FOR
				SELECT volume, datetime FROM v_space
				ORDER BY datetime ASC;
	END

	OPEN @cursor
	FETCH NEXT FROM @cursor INTO @volume, @datetime

	WHILE (@@FETCH_STATUS = 0)
	BEGIN
		SET @shrinkedSpace = @shrinkedSpace + @volume
		IF @shrinkedSpace >= @targetSpace
			BREAK;

		FETCH NEXT FROM @cursor INTO @volume, @datetime
	END
	CLOSE @cursor

	DELETE FROM Inspect.media
	WHERE datetime <= @datetime
GO

CREATE PROCEDURE doTruncate
AS
	-- -------------------------------------------------------
	--	INITIALIZATION
	--		1. DRIVE LETTER
	--		2. LEFT SPACE
	-- -------------------------------------------------------
	--DRIVE INFORMATION
	DECLARE @drive NCHAR(1)
	DECLARE @freeSpace BIGINT;
	
	--TRUNCATION RULE
	DECLARE @limitSpace BIGINT;
	DECLARE @limitDay INT;
	DECLARE @unit FLOAT;

	--TARGET
	DECLARE @usedSpace BIGINT;
	DECLARE @targetSpace BIGINT;

	--PROCESS
	DECLARE @shrinkedSpace BIGINT = 0;

	--FETCH DRIVE INFORMATION
	SELECT DISTINCT @drive = UPPER(LEFT(physical_name, 1))
		FROM sys.master_files
			WHERE name=N'OraQ';
	SELECT DISTINCT @freeSpace = dovs.available_bytes
		FROM sys.master_files mf
			CROSS APPLY sys.dm_os_volume_stats(mf.database_id, mf.FILE_ID) dovs
		WHERE UPPER(LEFT(dovs.volume_mount_point, 1)) = @drive;
	
	--FETCH RULE
	SELECT TOP(1) @limitDay = T.dayLimit, @limitSpace = T.leftSpace, @unit = T.unit
		FROM Server.truncationRule T, History.history H
		WHERE T.uid = H.uid
			ORDER BY H.datetime;
	SET @limitSpace = @limitSpace * 1024 * 1024 * 1024

	--BREAK_POINT
	IF(@freeSpace > @limitSpace)
		RETURN 1;
	
	--USED_SPACE & TARGET_SPACE
	SELECT @usedSpace = SUM(volume)
	FROM
	(
		SELECT SUM(DATALENGTH(data)) volume
		FROM Inspect.imageData
			UNION ALL
		SELECT SUM(DATALENGTH(data)) volume
		FROM Inspect.nonDicomFile
	) T;
	IF @usedSpace * @unit > @limitSpace - @freeSpace OR @limitSpace > @usedSpace
		SET @targetSpace = @usedSpace * @unit
	ELSE
		SET @targetSpace = @limitSpace - @freeSpace

	-- -------------------------------------------------------
	--	EXCEPTION CASE -> CONTRADICTORY SITUATION
	--		ALWAYS DELETE ALL INSPECTS BY RULE, 
	--		SO THAT NEED TO MODIFY TRUNCATION RULE
	-- -------------------------------------------------------
	IF @targetSpace > @usedSpace
	BEGIN
		DELETE FROM Inspect.media;
		RETURN 0;
	END

	-- -------------------------------------------------------
	--	-> TRUNCATION LOOP
	--		1) WITH DAYS
	--		2) WITHOUT DAYS (ALL RANGE)
	--
	--		* INTERNAL ROUTINE
	--			1. CANDIDATES OF DELETION
	--			2. ARCHIVED
	--			3. REQUESTED TO BE DELETED
	--			4. ALL
	-- -------------------------------------------------------
	SELECT @usedSpace, @targetSpace, @shrinkedSpace

	EXEC doTruncateByStatus @targetSpace, 22, @limitDay, @shrinkedSpace
	EXEC doTruncateByStatus @targetSpace, 21, @limitDay, @shrinkedSpace
	EXEC doTruncateByStatus @targetSpace, 12, @limitDay, @shrinkedSpace
	EXEC doTruncateByStatus @targetSpace, NULL, @limitDay, @shrinkedSpace

	EXEC doTruncateByStatus @targetSpace, 22, NULL, @shrinkedSpace
	EXEC doTruncateByStatus @targetSpace, 21, NULL, @shrinkedSpace
	EXEC doTruncateByStatus @targetSpace, 12, NULL, @shrinkedSpace
	EXEC doTruncateByStatus @targetSpace, NULL, NULL, @shrinkedSpace

	--SELECT @usedSpace, @targetSpace, @shrinkedSpace
GO