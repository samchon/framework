CREATE VIEW NamTree.v_file
AS
SELECT 
	F.*,
	N.header, N.getFunction, N.composerFunction, N.returnType, N.otherside
FROM 
	FileTree.v_file F LEFT OUTER JOIN NamTree.file N
		ON F.fileID = N.fileID;



CREATE VIEW NamTree.v_dataParameter
AS
SELECT D.*, P.name, P.type
FROM NamTree.dataParameter D, NamTree.parameter P
WHERE D.parameterID = P.parameterID;

CREATE VIEW NamTree.v_indexParameter
AS
SELECT D.*, P.name, P.type
FROM NamTree.indexParameter D, NamTree.parameter P
WHERE D.parameterID = P.parameterID;

CREATE VIEW NamTree.v_commonParameter
AS
SELECT C.*, P.name, P.type, P.initialValue
FROM NamTree.commonParameter C, NamTree.parameter P
WHERE C.parameterID = P.parameterID;



CREATE VIEW NamTree.v_fileParameter
AS
SELECT F.*, P.name, P.type, P.initialValue
FROM NamTree.fileParameter F, NamTree.parameter P
WHERE F.parameterID = P.parameterID;

CREATE VIEW NamTree.v_parameterDetermined
AS
SELECT P.fileID, D.*
FROM NamTree.fileParameter P, NamTree.parameterDetermined D
WHERE P.parameterID = D.parameterID;