/*
	String name;		//	0
	String mobile;		//	17
	String mail;		//	18
	String note;		//	4
	String position;	//	3

	String major;		//	1
	String corporateName;	//	2
*/
CREATE TABLE Yonsei.t_alumni
(
	no		INT		PRIMARY KEY	AUTO_INCREMENT,
	name		VARCHAR(40),
	mobile		VARCHAR(40),
	mail		VARCHAR(100),
	note		VARCHAR(100),
	position	VARCHAR(100),
	
	major		VARCHAR(100),
	corporateName	VARCHAR(200)
);
CREATE TABLE Yonsei.alumni
(
	no		INT		PRIMARY KEY,
	name		VARCHAR(40),
	mobile		VARCHAR(40),
	mail		VARCHAR(100),
	note		VARCHAR(100),
	position	VARCHAR(100),
	
	major		VARCHAR(100),
	corporateKey	CHAR(8)
);
