<?

	function getReport($report) {
		global $stmt;
		global $code, $standard, $period, $length;
		
		$volume = $length;
		
		//GET COMPONENT's META-DATA
		$stmt->prepare("SELECT * FROM Report.component
						WHERE code = ? AND report = ? AND standard= ?");
		$stmt->bind_param("sdd", $code, $report, $standard);
		$components = getRecordMaps($stmt);
		
		//echo "components: ".count($components)."\n";
		
		//GET VALUE
		$stmt->prepare("SELECT * FROM
				(
					SELECT * FROM Report.report
					WHERE code = ? AND
						report = ? AND standard = ? AND period = ?
					ORDER BY date DESC LIMIT ?
				) AS fake 
				ORDER BY date ASC");
		$stmt->bind_param("sdddd", $code, $report, $standard, $period, $volume);
		
		$valueMaps = getRecordMaps($stmt);
		$volume = count($valueMaps);
		
		//echo "components: ".count($valueMaps)."\n";
		
		/*
			code		CHAR(10),
			report		SMALLINT,
			standard 	SMALLINT,
			period		SMALLINT,
			date		DATE,
		*/
		$xml = "	<report report='{$report}'>\n";
		for($i = 0; $i < count($components); $i++) {
			$line = "";
			if($i > 0) {
				
			}
			
			//FROM START TO NAME
			$level = $components[$i]->level;
			$line.= sprintf("%s<report label='%s' ", getTab($level+1), $components[$i]->name);
			
			//VALUE WRITING
			for($j = 0; $j < $volume; $j++) {
				$value = $valueMaps[$j]->{"item".($i+1)};
				if(!$value)
					$value = INT_MIN;
				$line.= sprintf("date%d = '%d' ", $j, $value);
			}
			//CONSIDER NEXT LEVEL
			if($i < count($components) - 1) {
				$nextLevel = $components[$i+1]->level;
				
				if($nextLevel == $level) //NEXT IS SAME
					$line.= "/>\n";
				else if($nextLevel > $level) {//IS BIGGER
					$line.= ">\n";
				}else{//IS SMALLER
					$gapLevel = $level - $nextLevel;
					$line.= "/>\n";
					for($j = 0; $j < $gapLevel; $j++)
						$line.= getTab($level - $j)."</report>\n";
				}
			}else{ //LAST ITEM
				$line.= "/>\n";
				for($j = 0; $j < $level - 1; $j++)
					$line.= getTab($level - $j)."</report>\n";
			}
			$xml.= $line;
		}
		$xml.= "	</report>\n";
		
		return $xml;
	}

?>