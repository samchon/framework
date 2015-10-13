CREATE VIEW FileTree.v_file
AS
SELECT 
	application, category, fileID,
	CASE owner = 'example' AND parentID = 0
		WHEN TRUE THEN -1
		ELSE parentID
	END AS parentID, 
	owner, name, extension, content, comment
FROM 
	FileTree.file2;