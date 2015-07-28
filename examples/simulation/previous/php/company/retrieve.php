<?
	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<company>\n";

	include("../../../ConDBi.php");
	include("getXML.php");
	
	/*
	===============================================
		POST PARAM
	===============================================
	*/
	$condition = $_POST["condition"];
	$order = $_POST["order"];
	$standard = $POST["standard"];
	
	if(!$condition)	$condition = "1 = 1";
	if(!$order)		$order = "marketCap DESC";
	if(!$standrad)	$standard = 1;
	
	/*
	===============================================
		SELECT
	===============================================
	*/				
	$stmt -> prepare("SELECT * FROM Company.mv_retrieve WHERE standard = ? AND {$condition} ORDER BY {$order}");
	$stmt -> bind_param("d", $standard);
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
	
	echo "</company>";
	
	$stmt -> close();
	$mysqli -> close();
?>
