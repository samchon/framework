CREATE VIEW BackTesting.v_file
AS
SELECT 
	N.*, 
	B.buyingMinimum, B.buyingMaximum,
	B.sellingMinimum, B.sellingMaximum,
	B.accuracy
FROM 
	NamTree.v_file N LEFT OUTER JOIN BackTesting.file B 
		ON N.fileID = B.fileID
	WHERE N.application = 1 AND N.category = 1003;