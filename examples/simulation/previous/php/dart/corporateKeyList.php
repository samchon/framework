<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<corporateKey>\n";

	include("../../../ConDBi.php");
	
	/*$query="SELECT C.corporateKey 
		FROM Dart.corporation C LEFT OUTER JOIN
		(
			SELECT DISTINCT corporateKey
			FROM Dart.corporateNameHistory
		) H ON C.corporateKey = H.corporateKey
		WHERE H.corporateKey IS NULL";*/
	$query="SELECT C.corporateKey 
		FROM Dart.corporation
	$stmt->prepare($query);
	$stmt->execute();
	$stmt->bind_result($key);
	
	$xml = "";
	while($stmt -> fetch())
		$xml.= "	<corporateKey>{$key}</corporateKey>\n";
	$xml.= "</corporateKey>";
	
	echo $xml;
	
	$stmt -> close();
	$mysqli -> close();

?>