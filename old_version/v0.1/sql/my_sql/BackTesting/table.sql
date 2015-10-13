CREATE TABLE BackTesting.file
(
	fileID INT PRIMARY KEY,
	buyingMinimum DOUBLE,
	buyingMaximum DOUBLE,
	sellingMinimum DOUBLE,
	sellingMaximum DOUBLE,
	accuracy INT
);