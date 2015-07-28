<?

	function getIndex() {
		global $stmt, $codeArray;
		
		/*
		========================================================
			GET COMPONENTS
		========================================================
		*/
		//GET COMPONENT's META-DATA
		$stmt->prepare("SELECT coalesce(pid, 0) pid, field, name 
						FROM Index.reportComponent
						ORDER BY uid ASC");
		$components = getRecordMaps($stmt);
		
		/*
		========================================================
			GET RECORDS
		========================================================
		*/
		$query = "SELECT * FROM Corporate.v_retrieve\n".
					"WHERE code IN ".getInStatement($codeArray)."\n".
					"ORDER BY CASE code\n";
		for($i = 0; $i < count($codeArray); $i++)
			$query.= "	WHEN ".$codeArray[$i]." THEN ".$i."\n";
		$query.= "END";
		
		$stmt->prepare($query);
		$recordMaps = getRecordMaps($stmt);
		
		$gaapMaps = array();
		$ifrsMaps = array();
		
		for($i = 0; $i < count($recordMaps); $i++)
			if($recordMaps[$i]->standard == 1)
				$gaapMaps[] = $recordMaps[$i];
			else
				$ifrsMaps[] = $recordMaps[$i];
				
		$xml = indexToXMLList($gaapMaps, $components, 1);
		$xml.= indexToXMLList($ifrsMaps, $components, 2);
		
		return $xml;
	}
	function indexToXMLList($recordMaps, $components, $standard) {
		$xml = "	<index standard='{$standard}'>\n";
		
		for($i = 0; $i < count($components); $i++) {
			if($components[$i]->pid == 0)
				$line = sprintf("%s<index label='%s'>\n", getTab(2), $components[$i]->name);
			else{
				$line = sprintf("%s<index label='%s' ", getTab(3), $components[$i]->name);
				
				for($j = 0; $j < count($recordMaps); $j++) {
					$value = $recordMaps[$j]->{ $components[$i]->field };
					if($value === NULL)
						$value = INT_MIN;
					
					//WRITING
					$line.= sprintf("company%d = '%f' ", $j, $value);
				}
				$line.= "/>\n";
				
				if($i == count($components) - 1 || $components[$i+1]->pid == 0)
					$line.= getTab(2)."</index>\n";
			}
			$xml.= $line;
		}
		
		$xml.= "	</index>\n";
		return $xml;
	}
	
?>