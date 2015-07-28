<?

	echo "<?xml version='1.0' encoding='utf-8' ?>\n";
	echo "<company>\n";
	
	include("../../../ConDBi.php");
	
	$stmt -> prepare("SELECT name, code, market FROM Corporate.list WHERE market != 0 ORDER BY code");
	$stmt -> execute();
	$stmt -> bind_result($name, $code, $market);
	
	$xml = "";
	$i = 0;
	
	while($stmt -> fetch())
		$xml.="\t<company no='".++$i."' name='".urlencode($name)."' code='".$code."' market='".$market."' /> \n";
	
	echo $xml;
	echo "</company>";
	
?>