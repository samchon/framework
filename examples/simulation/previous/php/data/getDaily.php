<?

	function getDaily() {
		global $stmt, $code, $startDate, $endDate;
		
		$stmt->prepare("SELECT *
						FROM Price.daily 
						WHERE code=? AND date between ? and ?
						ORDER BY date");
		$stmt -> bind_param("sss", $code, $startDate, $endDate);
		
		$xml = "	<daily>\n";
		$xml.= getRecordXML($stmt, "candle", 2, false);
		$xml.= "	</daily>\n";
		
		return $xml;
	}

?>