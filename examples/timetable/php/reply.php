<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<board>\n";

	include("../ConDBi.php");
	
	/*
	==============================================
		POST VARS
	==============================================
	*/
	$uid = $_POST["uid"];
	$id = getID($application);
	$title = $_POST["title"];
	$content = $_POST["content"];
	
	/*
	==============================================
		INSERT REPLY
	==============================================
	*/
	$stmt->prepare("INSERT INTO Board.board
					SELECT 
						'', #uid(auto_increment)
						pid,
						application,
						category,
						
						?, #--> id
						?, #--> title
						?, #--> content
						now(), #timestamp
						0, #hit
						
						CASE
							WHEN right_depth IS NULL THEN
								CONCAT(depth, 'A')
							ELSE
								CONCAT(depth, CHAR(ASCII(right_depth) + 1))
						END depth,
						1 #live
					FROM
					(
						SELECT B.application, B.category, B.pid, B.depth, right(D.depth, 1) right_depth
						FROM 
							Board.board B LEFT OUTER JOIN Board.board D
								ON B.pid = D.pid AND
									length(D.depth) = length(B.depth) + 1 AND
									locate(B.depth, D.depth) = 1
							WHERE B.uid = ? #parent uid -> as a role of fid
							ORDER BY D.depth DESC LIMIT 1
					) P");
	$stmt -> bind_param("sssd", $id, $title, $content, $uid);
	$stmt -> execute();
	
	$result = getResult($stmt);
	
	echo "	<result>".$result."</result>\n";
	echo "</board>";
	
	$stmt -> close();
	$mysqli -> close();

?>