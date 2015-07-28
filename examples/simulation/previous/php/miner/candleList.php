<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<candleList>\n";

	include("../../../ConDBi.php");
	
	/*
	===============================================
		POST PARAM
	===============================================
	*/
	$code = $_POST["code"];
	if(!$code)	$code = "005930";

	$query = 
			"SELECT count(date)
			FROM Price.price
			WHERE
				code = ? AND 
				date >
				(
					SELECT max(date) 
					FROM Price.techIndex
					WHERE code = ?
				);";
	$stmt -> prepare($query);
	$stmt -> bind_param("ss", $code, $code);
	
	//GET VOLUME
	$stmt -> execute();
	$stmt -> bind_result($volume);
	$stmt -> fetch();
	
	$volume = $volume + 199;
		
	$query = 
		"
		SELECT * FROM 
		(
			SELECT date, high, low, open, close, volume
			FROM Price.price
			WHERE code=?
			ORDER BY date DESC LIMIT ?
		) AS fake
		ORDER BY date ASC";
	$stmt -> prepare($query);
	$stmt -> bind_param("sd", $code, $volume);
	
	$xml = getRecordXML($stmt, "candle", 1, false, false);
	$xml.= "	<diffVolume>".($stmt->num_rows - $volume)."</diffVolume>\n";
	$xml.= "</candleList>";

	$stmt -> free_result();
	$stmt -> close();
	$mysqli -> close();
	
	echo $xml;

?>