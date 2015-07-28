<?
	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<corporateList>\n";

	include("../../../ConDBi.php");
	include("getXML.php");
	
	/*
	===============================================
		POST PARAM
	===============================================
	*/
	$field = $_POST["field"];
	$value = $_POST["value"];
	
	/*
	===============================================
		SELECT
	===============================================
	*/
	if($field)
		$query = "SELECT * FROM Company.v_list
					where {$field} REGEXP '{$value}'
					ORDER BY name";
	else
		$query = "SELECT * FROM Company.v_list
					ORDER BY name";
					
	$stmt -> prepare($query);
	$recordMaps = getRecordMaps($stmt, false);
	$metadata = $stmt -> result_metadata(); 
	$fields = $metadata -> fetch_fields();
	
	$stmt -> free_result();
	$stmt -> close();
	$mysqli -> close();
	
	/*
	===============================================
		XML EXPRESSING
	===============================================
	*/
	echo getXML($recordMaps, $fields, 1);
	echo getXML($recordMaps, $fields, 2);
	
	echo "</corporateList>";
	
	
?>
