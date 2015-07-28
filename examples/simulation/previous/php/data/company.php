<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	
	/*
	===============================================
		POST PARAM
	===============================================
	*/
	$code		=	$_POST["code"];
	$name		=	$_POST["name"];
	$startDate	=	$_POST["startDate"];
	$endDate	=	$_POST["endDate"];
	$standard	=	$_POST["standard"];
	$period		=	$_POST["period"];

	echo "<company code='{$code}' name='{$name}'>\n";

	/*
	===============================================
		INCLUDE
	===============================================
	*/
	include("../../../ConDBi.php");
	include("getDaily.php");
	include("getIndex.php");
	
	/*
	===============================================
		CANDLE
	===============================================
	*/
	echo getDaily();
	
	/*
	===============================================
		FINANCIAL INDEX ABOUT REPORT
	===============================================
	*/
	
	if($standard != 0 && $period != 0) {		
		$standardArray = array();
		$periodArray = array();
		
		if($standard == 1 || $standard == 3)	$standardArray[] = 1;
		if($standard == 2 || $standard == 3)	$standardArray[] = 2;
		
		if($period == 1 || $period == 5)		$periodArray[] = 1;
		if($period == 4 || $period == 5)		$periodArray[] = 4;
		
		for($i = 0; $i < count($standardArray); $i++)
			for($j = 0; $j < count($periodArray); $j++)
				echo getIndex($standardArray[$i], $periodArray[$j]);
	}
	
	echo "</company>";
	
	$stmt -> free_result();
	$stmt -> close();
	$mysqli -> close();
	
	echo $xml;

?>