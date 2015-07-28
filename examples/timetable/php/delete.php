<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<board>\n";
	
	include("../ConDBi.php");
	
	$uid = $_POST["uid"];
	
	$stmt->prepare("UPDATE Board.board 
					SET live = 0 
						WHERE uid = ? AND id = ?");
	$stmt -> bind_param("ds", $uid, getID($application));
	$stmt -> execute();
	$result = getResult($stmt);
	
	echo "	<result>".$result."</result>\n";
	echo "</board>";
	
	$stmt -> close();
	$mysqli -> close();

?>