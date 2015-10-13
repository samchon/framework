CREATE VIEW Member.v_recent_login
AS
SELECT application, id, max(timestamp) timestamp, ip
FROM Member.login
GROUP BY application, id;