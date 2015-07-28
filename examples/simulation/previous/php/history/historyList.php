<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<historyList>\n";
	
	/* ==============================================================================
		RECEIVED PARAMETERS
	============================================================================== */
	$priceLength = $_POST["priceLength"];
	$indexLength = $_POST["indexLength"];
	$indexGY = $_POST["indexGY"];
	$indexGQ = $_POST["indexGQ"];
	$indexIY = $_POST["indexIY"];
	$indexIQ = $_POST["indexIQ"];
	
	$startDate = $_POST["startDate"];
	$endDate = $_POST["endDate"];
	
	/* ==============================================================================
		INCLUDES AND CLASSES
	============================================================================== */
	include("../../../ConDBi.php");
	include("IndexList.php");
	include("History2.php");
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