CREATE TABLE subject (
	code CHAR(7),
	name VARCHAR(100),
	kind VARCHAR(10),
	grade INTEGER,
	credit INTEGER,
	
	PRIMARY KEY(code)
);

CREATE TABLE class (
	code CHAR(7),
	divide CHAR(1),
	professor VARCHAR(100),
	mid CHAR(2),
	plan CHAR(100),
	
	PRIMARY KEY(code, divide) 
);

CREATE TABLE time (
	code CHAR(7),
	divide CHAR(1),
	classroom VARCHAR(100),
	week INTEGER,
	hour INTEGER,
	
	PRIMARY KEY(code, divide, week, hour) 
);

CREATE TABLE application (
	code CHAR(7) NOT NULL,
	divide CHAR(1) NOT NULL,
	
	PRIMARY KEY(code) 
);

CREATE TABLE history (
	year INTEGER,
	semester INTEGER,
	code CHAR(7),
	divide CHAR(1),
	kind VARCHAR(10),
	credit INTEGER,
	
	PRIMARY KEY(year, semester, code, divide) 
);

CREATE INDEX idx_time ON time(code, divide);
CREATE VIEW v_creditHistory 
AS 
SELECT kind, SUM(credit) credit, MAX(code) code 
FROM 
( 
	SELECT code, max(kind) kind, max(credit) credit 
	FROM history 
	GROUP BY code 
) 
GROUP BY kind;

CREATE VIEW v_creditApplication 
AS 
SELECT S.kind, SUM(S.credit) credit, MAX(S.code) code 
FROM 
	application A LEFT OUTER JOIN subject S 
	ON A.code = S.code 
GROUP BY S.kind;

CREATE VIEW v_creditTotal 
AS 
SELECT kind, SUM(credit) credit, MAX(code) code 
FROM 
( 
	SELECT code, MAX(kind) kind, MAX(credit) credit 
	FROM 
	( 
		SELECT code, credit, kind 
		FROM history 
 
		UNION ALL 
 
		SELECT A.code, S.credit, S.kind 
		FROM application A 
			LEFT OUTER JOIN subject S 
				ON A.code = S.code 
	) 
	GROUP BY code 
) 
GROUP BY kind;
CREATE VIEW v_list
AS
SELECT T.code, S.name, S.kind, C.mid, S.credit, C.divide, S.grade, C.professor, T.week, T.hour, T.classroom, C.plan
FROM
	time T LEFT OUTER JOIN class C
		ON T.code = C.code AND T.divide = C.divide
	LEFT OUTER JOIN subject S
		ON T.code = S.code;

CREATE VIEW v_application
AS
SELECT A.code, S.name, A.divide, S.kind, S.credit, C.professor, C.plan
FROM application A
	LEFT OUTER JOIN subject S
		ON A.code = S.code
	LEFT OUTER JOIN class C
		ON A.code = C.code AND A.divide = C.divide;

CREATE VIEW v_table
AS
SELECT S.name, A.divide, C.professor, T.classroom, T.week, T.hour
FROM application A
	LEFT OUTER JOIN subject S
		ON A.code = S.code
	LEFT OUTER JOIN class C
		ON A.code = C.code AND A.divide = C.divide
	INNER JOIN time T
		ON A.code = T.code AND A.divide = T.divide;