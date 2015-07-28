<?

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