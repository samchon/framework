INSERT INTO FileTree2.file
SELECT uid, pid, application, category, id as owner, name, NULL as content, 1 as live
FROM FileTree.folder
WHERE application = 1 AND category = 3 AND live = 1
UNION ALL
SELECT '' as uid, F.pid, D.application, D.category, D.id as owner, concat(F.name, '.as') name, F.content, 1 as live
FROM FileTree.folder D INNER JOIN FileTree.file F
		ON D.uid = F.pid
WHERE D.application = 1 AND D.category = 3 AND D.live = 1;