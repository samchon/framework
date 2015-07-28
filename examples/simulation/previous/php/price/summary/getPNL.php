<?

function getPNL($standard) {
	global $stmt, $code, $category;
	
	if($category == 1) {
		$inStatement = "('매출액', '매출액(수익)', '매출총이익', '영업이익', '법인세차감전계속사업이익', '당기순이익')";
		$items = array("Sales", "Gross Profit", "Operating Profit", "Earnings Before Tax", "Net Income");
	}else if($category == 2) {
		$inStatement = "('영업수익', '순영업이익', '영업이익', '법인세차감전계속사업이익', '법인세차감전계속사업손익', '당기순이익')";
		$items = array("Operating Revenue", "Operating Profit", "Earnings Before Tax", "Net Income");
	}
	/*
	=======================================================================
		GET ITEM NUMBER
	=======================================================================
	*/
	$stmt->prepare("SELECT	uid 
					FROM	Report.component
					WHERE	report = 2 AND
							code = ? AND standard = ? AND
							name IN {$inStatement}
					ORDER BY uid ASC");
	$stmt->bind_param("sd", $code, $standard);
	$components = getRecordMaps($stmt);
	
	//Composing QUERY
	$query = "
			SELECT * FROM
			(
				SELECT date";
	for($i = 0; $i < count($components); $i++)
		$query.= ", item".$components[$i]->uid;
	$query.= " FROM Report.report
				WHERE code = ? AND report=2 AND standard = ? AND period=4
				ORDER BY date DESC LIMIT 4
			) AS fake
			ORDER BY date ASC";
	
	$stmt->prepare($query);
	$stmt->bind_param("sd", $code, $standard);
	$recordMaps = getRecordMaps($stmt);
	
	//TO XML
	$xml = "		<pnl>\n";
	for($i = 0; $i < count($recordMaps); $i++) {
		$line = "			<pnl>\n";
		$line.= "				<date>{$recordMaps[$i]->date}</date>\n";
		
		if($category == 1) {
			$line.= "				<sales>".$recordMaps[$i]->{ "item".$components[0]->uid }."</sales>\n";
			$line.= "				<grossProfit>".$recordMaps[$i]->{ "item".$components[1]->uid }."</grossProfit>\n";
			$line.= "				<operatingProfit>".$recordMaps[$i]->{ "item".$components[2]->uid }."</operatingProfit>\n";
			$line.= "				<earningsBeforeTax>".$recordMaps[$i]->{ "item".$components[3]->uid }."</earningsBeforeTax>\n";
			$line.= "				<netIncome>".$recordMaps[$i]->{ "item".$components[4]->uid }."</netIncome>\n";
		}else if($category == 2) {
			$line.= "				<operatingRevenue>".$recordMaps[$i]->{ "item".$components[0]->uid }."</operatingRevenue>\n";
			$line.= "				<operatingProfit>".$recordMaps[$i]->{ "item".$components[1]->uid }."</operatingProfit>\n";
			$line.= "				<earningsBeforeTax>".$recordMaps[$i]->{ "item".$components[2]->uid }."</earningsBeforeTax>\n";
			$line.= "				<netIncome>".$recordMaps[$i]->{ "item".$components[3]->uid }."</netIncome>\n";
		}
		$line.= "			</pnl>\n";
		$xml.= $line;
	}
	$xml.= "		</pnl>\n";
	
	return $xml;
}

?>