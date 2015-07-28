<?
	echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
	echo "<component>\n";

	include("../../../ConDBi.php");
	
	//GET COMPONENT's META-DATA
	$stmt->prepare("SELECT coalesce(pid, 0) pid, field, name, engName
					FROM Index.reportComponent
					ORDER BY uid ASC");
	$components = getRecordMaps($stmt);
	
	//XML
	$xml = "";
	for($i = 0; $i < count($components); $i++) {
		if($components[$i]->pid == 0)
			$line = sprintf("%s<component name='%s' engName='%s'>\n", getTab(1), $components[$i]->name, $components[$i]->engName);
		else{
			$line = sprintf("%s<component name='%s' engName='%s' field='%s' />\n", getTab(2), $components[$i]->name, $components[$i]->engName, $components[$i]->field);
			if($i == count($components) - 1 || $components[$i+1]->pid == 0)
				$line.= getTab(1)."</component>\n";
		}
		$xml.= $line;
	}
	$xml.= "</component>\n";
	
	echo $xml;
	
?>
