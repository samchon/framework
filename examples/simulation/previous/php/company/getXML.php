<?
	
	/*
	===============================================
		PROCEDURE
	===============================================
	*/
	$no = 1;
	function getXML($recordMaps, $fields, $market) {
		global $no;
		
		if($market == 1)	$name = "KOSPI";
		else				$name = "KOSDAQ";
		
		$xml = "	<company name='{$name}'>\n";
		
		for($i = 0; $i < count($recordMaps); $i++) {
			if( $recordMaps[$i]->market != $market)
				continue;
			$line = "		<company no='{$no}' ";
			foreach($fields as $field) {
				$value = $recordMaps[$i]->{$field->name};
				if($value === null)		$value = INT_MIN;
				$line.= $field->name."='".$value."' ";
			}
			$line.= "/>\n";
			$xml.= $line;
			$no++;
		}
		$xml.= "	</company>\n";
		return $xml;
	}
	
?>
