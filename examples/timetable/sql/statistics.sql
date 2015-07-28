#최근 학기
CREATE VIEW v_semester
AS
SELECT year, max(semester) semester
FROM timetable
WHERE year = 
(
	SELECT max(year) 
	FROM timetable
);

#최근 학기의 시간표 아이디
CREATE VIEW v_timetable
AS
SELECT M.name, T.id, T.uid, T.timestamp
FROM v_member M, timetable T, v_semester S
WHERE 
	M.id = T.id AND
	T.year = S.year AND T.semester = S.semester;

#최근 학기 중 가장 최근의 시간표 아이디
CREATE VIEW v_recent_timetable
AS
SELECT name, id, max(uid) uid, timestamp
FROM v_timetable
GROUP BY id;

#최근 학기 중 가장 최근의 시간표
CREATE VIEW v_recent_timetable_code
AS
SELECT T.name, T.id, C.code, C.divide, T.timestamp
FROM v_recent_timetable T, timetable_code C
WHERE T.uid = C.uid;

#경합
CREATE VIEW v_race
AS
SELECT code, divide, count(code) race
FROM v_recent_timetable_code
GROUP BY code, divide;

#포화도
CREATE VIEW v_saturation
AS
SELECT
	code, divide, race, 
	race / (SELECT avg(race) FROM v_race) saturation
FROM v_race;

/* 
-----------------------------------------------------------------------------------
	기타 SQL
-----------------------------------------------------------------------------------
*/
#학번
CREATE VIEW v_grade_count
AS
SELECT substr(id, 1, 2) gradeNo, count(*) count 
FROM v_member 
GROUP BY substr(id, 1, 2);

#전공
CREATE VIEW v_major_count
AS
SELECT substr(id, 3, 2) majorNo, count(*) count 
FROM v_member 
GROUP BY substr(id, 3, 2);

#복합
CREATE VIEW v_grade_major_count
AS
SELECT substr(id, 1, 2) gradeNo, substr(id, 3, 2) majorNo, count(*) count 
FROM v_member 
GROUP BY substr(id, 1, 2), substr(id, 3, 2);

/* 
-----------------------------------------------------------------------------------
	응용 SQL
-----------------------------------------------------------------------------------
*/
#내 과목의 포화도
SELECT S.* 
FROM v_saturation S, v_recent_timetable_code C
WHERE C.id = '1194060' AND
	S.code = C.code AND S.divide = C.divide;

#강의실 친구들
SELECT C.name, C.id, C.code, C.divide, C.timestamp
FROM
	v_recent_timetable_code C,
	(
		SELECT code, divide
		FROM v_recent_timetable_code
		WHERE id = '1194060'
	) S
WHERE
	(C.code = S.code AND C.divide = S.divide) AND
	C.id <> '1194060'
ORDER BY S.code;

