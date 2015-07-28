<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<historyList>\n";
	
	/* ==============================================================================
		RECEIVED PARAMETERS
	============================================================================== */
	$priceLength = $_POST["priceLength"];
	$indexLength = $_POST["indexLength"];
	
	if(!$priceLength)	$priceLength = 1;
	if(!$indexLength)	$indexLength = 1;
	
	/* ==============================================================================
		INCLUDES AND CLASSES
	============================================================================== */
	include("../../../ConDBi.php");
	include("IndexList.php");
	include("History.php");
	include("HistoryMap.php");

	/*
	===============================================
		CONTENT
	===============================================
	*/
	$historyMap = new HistoryMap();
	echo $historyMap->toXML();
	echo "</historyList>";
	
	$stmt -> close();
	$mysqli -> close();
	
?>