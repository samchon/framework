CREATE VIEW Retrieve.v_file
AS
SELECT 
	N.*, R.priceLength, R.indexLength
FROM 
	NamTree.v_file N LEFT OUTER JOIN Retrieve.file R 
		ON N.fileID = R.fileID
	WHERE N.application = 1 AND N.category = 1001;