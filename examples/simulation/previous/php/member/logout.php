<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<logout>\n";

	session_start();
	unset($_SESSION["simulationID"]);
	
	echo "	<result>1</result>\n";
	echo "</logout>";

?>