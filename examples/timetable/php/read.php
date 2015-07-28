<? 

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<board>\n";
	
	include("../ConDBi.php");
	
	$uid = $_POST["uid"];
	
	$stmt->prepare("UPDATE Board.board
						SET hit = hit + 1 
							WHERE uid = ?");
	$stmt->bind_param("d", $uid);
	$stmt->execute();
	
	$stmt->prepare("SELECT	B.uid, concat(M.name, '(', M.id, ')') nickname,
							B.title, B.content,
							CASE date_format(B.timestamp, '%Y-%m-%d') != date_format(now(), '%Y-%m-%d')
								WHEN TRUE THEN 
									date_format(B.timestamp, '%Y-%m-%d')
								ELSE 
									date_format(B.timestamp, '%H:%i:%s')
							END timestamp,
							B.hit
					
					FROM	Board.board B, Member.list M
					
					WHERE	B.id = M.id AND uid = ?");
	
	$stmt->bind_param("d", $uid);
	echo getRecordXML($stmt, "list", 1, false, true, true);
	echo "</board>";
	
	$stmt -> close();
	$mysqli -> close();
 
?>