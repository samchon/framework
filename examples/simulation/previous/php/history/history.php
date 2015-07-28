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
	
	if(!$code)
	{
		$code = "005930";
		$name = "삼성전자";
		$startDate = "2011-01-01";
		$endDate = "2014-01-01";
		$standard = 3;
		$period = 5;
	}

	echo "<history code='{$code}' name='{$name}'>\n";

	/*
	===============================================
		INCLUDE
	===============================================
	*/
	include("../../../ConDBi.php");
	//include("getDaily.php");
	//include("getIndex.php");
	
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
		echo "	<indexListList>\n";
		
		$standardArray = array();
		$periodArray = array();
		
		if($standard == 1 || $standard == 3)	$standardArray[] = 1;
		if($standard == 2 || $standard == 3)	$standardArray[] = 2;
		
		if($period == 1 || $period == 5)		$periodArray[] = 1;
		if($period == 4 || $period == 5)		$periodArray[] = 4;
		
		for($i = 0; $i < count($standardArray); $i++)
			for($j = 0; $j < count($periodArray); $j++)
				echo getIndex($standardArray[$i], $periodArray[$j]);
				
		echo "	</indexListList>\n";
	}
	
	echo "</history>";
	
	$stmt -> free_result();
	$stmt -> close();
	$mysqli -> close();
	
	echo $xml;
	
	
	function getDaily() {
		global $stmt, $code, $startDate, $endDate;
		
		$stmt->prepare("SELECT *
						FROM Price.price 
						WHERE code=? AND date between ? and ?
						ORDER BY date");
		$stmt -> bind_param("sss", $code, $startDate, $endDate);
		
		$xml = "	<candleList>\n";
		$xml.= getRecordXML($stmt, "candle", 2, false);
		$xml.= "	</candleList>\n";
		
		return $xml;
	}
	function getIndex($standard, $period) {
		global $stmt, $code, $startDate, $endDate;
		
		$xml = sprintf("	<indexList standard='%d' period='%d'>\n", $standard, $period);
		$stmt->prepare("SELECT * FROM Index.report
						WHERE code = ? AND
							standard = ? AND period = ? AND
							date BETWEEN ? AND ?");
		$stmt->bind_param("sddss", $code, $standard, $period, $startDate, $endDate);
		$xml.= getRecordXML($stmt, "index", 2, false);
		$xml.= "	</indexList>\n";
		
		return $xml;
	}

?>