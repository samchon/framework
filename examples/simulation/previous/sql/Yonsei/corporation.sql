/*
	String corprateName;
	String president;
	String category;
	String mainProduct;
	String size;
	int employed;
	int establishedYear;
	int settledYear;
	long long asset;
	long long sales;
	String address;
	String tel;
	String fax;
*/
CREATE TABLE t_corporation
(
	no		int		PRIMARY KEY	AUTO_INCREMENT,
	corporateName	VARCHAR(200),
	president	VARCHAR(40),
	category	VARCHAR(200),
	mainProduct	VARCHAR(200),
	size		VARCHAR(10),
	employed	int,
	establishedYear	int,
	settledYear	int,
	asset		bigint,
	sales		bigint,
	address		VARCHAR(400),
	tel		CHAR(20),
	fax		CHAR(20)
);
CREATE TABLE corporation
(
	corporateKey	CHAR(8)		PRIMARY KEY,
	president	VARCHAR(40),
	category	VARCHAR(200),
	mainProduct	VARCHAR(200),
	size		VARCHAR(10),
	employed	int,
	establishedYear	int,
	settledYear	int,
	asset		bigint,
	saels		bigint,
	address		VARCHAR(400),
	tel		CHAR(20),
	fax		CHAR(20)
);