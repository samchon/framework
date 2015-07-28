<?

	function getIndex() {
		global $stmt;
		global $code, $standard, $period, $length;
		
		$volume = $length;
		
		$xml = "";
		
		//GET COMPONENT's META-DATA
		$stmt -> prepare("SELECT coalesce(pid, 0) pid, field, name 
							FROM Index.reportComponent
							ORDER BY uid ASC");
		$components = getRecordMaps($stmt);
		
		echo "code: {$code}\n";
		echo "standard: {$standard}\n";
		echo "period: {$period}\n";
		echo "volume: {$volume}\n";
		
		$query = "
				SELECT * FROM
				(	
					SELECT * FROM Index.report
					WHERE code = ? AND standard = ? AND period = ?
					ORDER BY date DESC LIMIT ?
				) AS fake
				ORDER BY date ASC";
		$stmt -> prepare($query);
		$stmt -> bind_param("sddd", $code, $standard, $period, $volume);
		$valueMaps = getRecordMaps($stmt);
		$volume = count($valueMaps);
		
		echo "code: {$code}\n";
		echo "standard: {$standard}\n";
		echo "period: {$period}\n";
		echo "volume: {$volume}\n";
		
		//DATE INFO
		$xml.= "	<date>\n";
		for($i = 0; $i < $volume; $i++)
			$xml.= sprintf("%s<date>%s</date>\n", getTab(2), $valueMaps[$i]->date);
		$xml.= "	</date>\n";
		
		//INDEX
		$xml.= "	<report report='0'>\n";
		for($i = 0; $i < count($components); $i++) {
			if($components[$i]->pid == 0)
				$line = sprintf("%s<report label='%s'>\n", getTab(2), $components[$i]->name);
			else{
				$line = sprintf("%s<report label='%s' ", getTab(3), $components[$i]->name);
				for($j = 0; $j < $volume; $j++) {
					$value = $valueMaps[$j]->{ $components[$i]->field };
					if($value === NULL)	$value = INT_MIN;
					$line.= sprintf("date%d = '%f' ", $j, $value);
				}
				$line.= "/>\n";
				
				if($i == count($components) - 1 || $components[$i+1]->pid == 0)
					$line.= getTab(2)."</report>\n";
			}
			$xml.= $line;
		}
		$xml.= "	</report>\n";
		return $xml;
	}

?>