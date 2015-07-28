<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<board>\n";
	
	include("../ConDBi.php");
	
	$uid = $_POST["uid"];
	$title = $_POST["title"];
	$content = $_POST["content"];
	
	$stmt->prepare("UPDATE Board.board 
					SET title = ?, content = ?, timestamp = now() 
						WHERE uid = ? AND id = ?");
	$stmt -> bind_param("ssds", $title, $content, $uid, getID($application));
	$stmt -> execute();
	$result = getResult($stmt);
	
	echo "	<result>".$result."</result>\n";
	echo "</board>";
	
	$stmt -> close();
	$mysqli -> close();

?>