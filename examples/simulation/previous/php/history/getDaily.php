<?

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

?>