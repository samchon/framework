<?

	function getPrice() {
		global $stmt, $codeArray, $startDate, $endDate;
		
		/*
		========================================================
			GET MINIMUM VOLUME
		========================================================
		*/
		$query = "SELECT min(volume)
						FROM
						(
							SELECT	count(code) volume
							FROM	Price.price
							WHERE	date BETWEEN ? AND ? AND 
							code IN ".getInStatement($codeArray)."
							GROUP BY code
						) AS fake";
		$stmt->prepare($query);
		$stmt->bind_param("ss", $startDate, $endDate);
		$stmt->execute();
		$stmt->bind_result($volume);
		$stmt->fetch();
		
		/*
		========================================================
			GET COMPARISON
		========================================================
		*/
		$priceArray = array();
		for($i = 0; $i < count($codeArray); $i++) {
			$stmt->prepare("SELECT * FROM
							(
								SELECT close as price, date FROM Price.price
								WHERE code = ? AND date <= ?
								ORDER BY date DESC LIMIT ?
							) AS fake
							ORDER BY date ASC");
			$stmt->bind_param("ssd", $codeArray[$i], $endDate, $volume);
			$recordMaps = getRecordMaps($stmt);
			$recordMaps = toPercent($recordMaps);
			
			$priceArray[] = $recordMaps;
		}
		
		/*
		========================================================
			WRITE XML
		========================================================
		*/
		$xml = "	<price>\n";
		for($i = 0; $i < count($priceArray[0]); $i++) {
			$line = "		<price date='".$priceArray[0][$i]->date."' ";
			
			for($j = 0; $j < count($priceArray); $j++)
				$line.= sprintf("company%d = '%f' ", $j, $priceArray[$j][$i]->price);
			
			$line.= "/>\n";
			$xml.= $line;
		}
		$xml.= "	</price>\n";
		
		return $xml;
	}
	function toPercent($recordMaps) {
		$denominator = $recordMaps[0]->price;
		for($i = 0; $i < count($recordMaps); $i++)
			$recordMaps[$i]->price = $recordMaps[$i]->price / $denominator;
		return $recordMaps;
	}
	
?>