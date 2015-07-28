<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<candleList>\n";

	include("../../../ConDBi.php");
	
	/*
	===============================================
		POST PARAM
	===============================================
	*/
	$code		=	$_POST["code"];
	$startDate	=	$_POST["startDate"];
	$endDate	=	$_POST["endDate"];
	//$volume		=	$_POST["volume"];
	
	echo "<formData>\n";
	echo "	<code>{$code}</code>\n";
	echo "	<startDate>{$startDate}</startDate>\n";
	echo "	<endDate>{$endDate}</endDate>\n";
	echo "</formData>\n";

	//if($startDate) {
		//counting
		$query = 
			"SELECT count(*)
				FROM Price.candle 
				WHERE code=? AND date between ? and ?
				ORDER BY date";
		$stmt -> prepare($query);
		$stmt -> bind_param("sss", $code, $startDate, $endDate);
	//}
	
	//GET VOLUME
	$stmt -> execute();
	$stmt -> bind_result($volume);
	$stmt -> fetch();
		
	$query = 
		"
		SELECT * FROM 
		(
			SELECT date, high, low, open, close, volume
			FROM Price.candle
			WHERE code=? AND date <= ?
			ORDER BY date DESC LIMIT ?
		) AS fake
		ORDER BY date ASC";

	$askedVolume = $volume;
	$volume = $volume + 200 - 1;
	
	$stmt -> prepare($query);
	$stmt -> bind_param("ssd", $code, $endDate, $volume);
	$xml = getRecordXML($stmt, "candle", 1, false, false);

	$xml.= "	<diffVolume>".($stmt->num_rows - $askedVolume)."</diffVolume>\n";
	$xml.= "	<code>{$code}</code>\n";
	$xml.= "</candleList>";

	$stmt -> free_result();
	$stmt -> close();
	$mysqli -> close();
	
	echo $xml;

?>