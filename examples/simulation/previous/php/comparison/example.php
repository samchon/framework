<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<corporateList>\n";
	
	include("../../../ConDBi.php");
	
	$code = $_POST["code"];
	if(!$code)	$code = "005930";
	
	$query = "	SELECT
					C.code, replace(L.name, '&', '앤') name
				FROM
					(
						SELECT ? as code
						UNION ALL
						SELECT cope as code FROM Company.sameCategory WHERE code = ?
					) as C,
					Company.list as L
				WHERE
					C.code = L.code";
	
	$stmt -> prepare($query);
	$stmt -> bind_param("ss", $code, $code);
	$stmt -> execute();
	$stmt -> bind_result($code, $name);
	
	$output = "";
	while( $stmt -> fetch() )
		$output.= "	<corporate code='{$code}' name='{$name}'/>\n";
	
	$output.= "</corporateList>";
	
	echo $output;
	$stmt -> close();
	$mysqli -> close();
	
?>