<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<insert>\n";

	ini_set('max_execution_time', 0);
	include("../../../ConDBi.php");
	
	$stmt->prepare($_POST["sql"]);
	
	if($stmt->execute() == true)
	{
		echo "	<result>ok</result>\n";
	}
	else
	{
		echo "	<result>failed</result>\n";
		echo "	<reason>".urlencode($stmt->error)."</reason>\n";
	}
	
	$stmt -> close();
	$mysqli -> close();
	
	echo "</insert>\n"

?>