<?

function getBS($standard) {
	global $stmt, $code, $category;
	
	$inStatement = "('자본', '자본총계', '부채', '부채총계', '유동자산', '유동부채')";
	/*
	=======================================================================
		GET ITEM NUMBER
	=======================================================================
	*/
	$stmt->prepare("SELECT	uid, name
					FROM	Report.component
					WHERE	report = 1 AND
							code = ? AND standard = ? AND
							name IN {$inStatement}
					ORDER BY name, uid ASC");
	$stmt->bind_param("sd", $code, $standard);
	$componentRecords = getRecordMaps($stmt);
	
	$components = array();
	for($i = 0; $i < count($componentRecords); $i++) {
		for($j = 0; $j < count($components); $j++)
			if($componentRecords[$i]->name == $components[$j]->name) {
				break;
			}
		if($j == count($components)) {
			$components[] = $componentRecords[$i];
		}
	}
	
	//Composing QUERY
	
	$query = "
				SELECT item".$components[0]->uid;
	for($i = 1; $i < count($components); $i++)
		$query.= ", item".$components[$i]->uid;
	$query.= "
				FROM Report.report
				WHERE code = ? AND report = 1 AND standard = ? AND period = 1
				ORDER BY date DESC LIMIT 1";
	$stmt->prepare($query);
	$stmt->bind_param("sd", $code, $standard);
	$stmt->execute();
	
	if(count($components) == 4) //category is 1
		$stmt->bind_result($currentDebt, $currentAsset, $debt, $capital);
	else
		$stmt->bind_result($debt, $asset);
	$stmt->fetch();
	
	//TO XML
	$xml = "		<bs>\n";
	if(count($components) == 4) {
		$xml.= sprintf
		(
"			<currentRatio>
				<label>Current Debt</label>
				<data>%d</data>
			</currentRatio>
			<currentRatio>
				<label>Current Asset</label>
				<data>%d</data>
			</currentRatio>\n", $currentDebt, $currentAsset
		);
	}
	$xml.= sprintf
	(
"			<debtRatio>
				<label>Debt</label>
				<data>%d</data>
			</debtRatio>
			<debtRatio>
				<label>Capital</label>
				<data>%d</data>
			</debtRatio>\n", $debt, $capital
	);
	$xml.=	"		</bs>\n";
	
	return $xml;
}

?>