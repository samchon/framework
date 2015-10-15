INSERT INTO Retrieve.file
SELECT fileID, 0, 1
FROM FileTree.file2
WHERE application = 1 AND category = 1001 AND extension = 'ntr';