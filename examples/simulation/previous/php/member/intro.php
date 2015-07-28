<?

	echo "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
	echo "<comment>\n";

	include("../../../ConDBi.php");
	
	$stmt->prepare("SELECT content FROM Application.comment
					WHERE application = ? AND category = ? AND component = ?");
		$application = "simulation";
		$category = "join";
		$component = "intro";
		
	$stmt->bind_param("sss", $application, $category, $component);
	$stmt->execute();
	
	$stmt->bind_result($comment);
	$stmt->fetch();
	
	echo urlencode($comment)."\n";
	echo "</comment>";
	
	$stmt -> close();
	$mysqli -> close();
?>