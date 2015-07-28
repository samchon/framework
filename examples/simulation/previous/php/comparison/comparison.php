<?

	function getInStatement($codeArray) {
		$statement = "('".$codeArray[0]."'";
		for($i = 1; $i < count($codeArray); $i++)
			$statement.= ", '".$codeArray[$i]."'";
		$statement.= ")";
		
		return $statement;
	}

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<comparison>\n";
	
	include("../../../ConDBi.php");
	include("getPrice.php");
	include("getIndex.php");
	
	if(!$_POST["codeArray"])	$_POST["codeArray"] = "005930||005380";
	if(!$_POST["startDate"])	$_POST["startDate"] = "2012-01-01";
	if(!$_POST["endDate"])		$_POST["endDate"] = "2014-01-01";
	
	$codeArray = explode( "||", $_POST["codeArray"] );
	$startDate = $_POST["startDate"];
	$endDate = $_POST["endDate"];
	
	echo getIndex();
	echo getPrice();
	
	echo "</comparison>";
	
	$stmt -> close();
	$mysqli -> close();

?>