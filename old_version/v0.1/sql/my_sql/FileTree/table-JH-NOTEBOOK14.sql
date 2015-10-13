CREATE TABLE FileTree2.file
(
	uid INT PRIMARY KEY AUTO_INCREMENT,
	pid INT DEFAULT 0,
	application INT NOT NULL,
	category INT NOT NULL,
	owner VARCHAR(100) NOT NULL,
	name VARCHAR(100) NOT NULL,
	extension CHAR(3),
	content TEXT
);