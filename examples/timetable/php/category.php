<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<board>\n";

	include("../ConDBi.php");
	
	$stmt->prepare("SELECT category, name 
					FROM Board.category
						WHERE application = ?");
	$stmt->bind_param("d", $application);
	
	echo getRecordXML($stmt, "category", 1, false, true, true);
	echo "</board>";
	
	$stmt -> close();
	$mysqli -> close();

?>