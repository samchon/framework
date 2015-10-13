CREATE TABLE FileTree.file2
(
	application SMALLINT,
	category SMALLINT,
	fileID INT PRIMARY KEY AUTO_INCREMENT,
	parentID INT,
	owner VARCHAR(100) NOT NULL,
	name VARCHAR(100) NOT NULL,
	extension CHAR(4),
	content TEXT
)